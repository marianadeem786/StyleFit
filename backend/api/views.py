from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from .supabase_client import supabase
from .utils import generate_otp
import json
import re
import ast
import os
from django.utils.timezone import now
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password
from datetime import datetime
import uuid
from django.core.files.uploadedfile import InMemoryUploadedFile
from dotenv import load_dotenv

@csrf_exempt
def signup_view(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST method allowed'}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON format'}, status=400)

    email = data.get('email')
    password = data.get('password')
    confirm_password = data.get('confirm_password')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    if not all([email, password, confirm_password, first_name, last_name]):
        return JsonResponse({'error': 'All fields are required'}, status=400)
    if len(password) < 8 or not re.search(r'[A-Z]', password) or not re.search(r'\W', password):
        return JsonResponse({'error': 'Password must be at least 8 characters, include one uppercase and one special character'}, status=400)

    if password != confirm_password:
        return JsonResponse({'error': 'Passwords do not match'}, status=400)
    login_check = supabase.table("login").select("email").eq("email", email).execute()
    if login_check.data:
        return JsonResponse({'error': 'Email already registered. Please login.'}, status=409)
    existing_signup = supabase.table("signup").select("id").eq("email", email).execute()
    if existing_signup.data:
        supabase.table("signup").delete().eq("email", email).execute()
    otp = generate_otp()
    result = supabase.table("signup").insert({
        "email": email,
        "password": password,
        "confirm_password": confirm_password,
        "first_name": first_name,
        "last_name": last_name,
        "otp": otp
    }).execute()
    if not result.data:
       return JsonResponse({'error': 'Signup failed. Could not save to Supabase.'}, status=500)
    try:
        send_mail(
        subject='Your OTP Code – StyleFit',
        message=f'Hi {first_name},\n\nHere is your OTP: {otp}\nIt’s valid for 10 minutes.\n\nThanks,\nStyleFit Team',
        from_email=os.getenv("EMAIL_HOST_USER"),
        recipient_list=[email],
        fail_silently=False,
    )

    except Exception as e:
        print("Email sending failed:", e)
        return JsonResponse({'error': 'Signup saved but OTP email failed to send.'}, status=500)

    return JsonResponse({'message': 'Signup successful. OTP sent to your email.'}, status=201)

@csrf_exempt
def verify_otp_view(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    email = data.get('email')
    otp_input = data.get('otp')

    if not email or not otp_input:
        return JsonResponse({'error': 'Email and OTP are required'}, status=400)

    signup_entry = supabase.table("signup").select("*").eq("email", email).execute()
    if not signup_entry.data:
        return JsonResponse({'error': 'No signup found for this email'}, status=404)
    
    user = signup_entry.data[0]
    if otp_input != user.get("otp"):
        return JsonResponse({'error': 'Invalid OTP'}, status=401)
    
    hashed_password = make_password(user["password"])

    default_picture_url = "https://your-project-id.supabase.co/storage/v1/object/public/profilepicture/default-avatar.png"

    result = supabase.table("login").insert({
        "email": user["email"],
        "password": hashed_password,
        "first_name": user["first_name"],
        "last_name": user["last_name"],
        "picture": default_picture_url
    }).execute()

    if not result.data:
        return JsonResponse({'error': 'Failed to create login account'}, status=500)
    supabase.table("signup").delete().eq("email", email).execute()

    return JsonResponse({'message': 'OTP verified. Account created successfully.'}, status=200)


@csrf_exempt
def login_view(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return JsonResponse({'error': 'Email and password are required'}, status=400)

    user_entry = supabase.table("login").select("*").eq("email", email).execute()
    if not user_entry.data:
        return JsonResponse({'error': 'User not found'}, status=404)

    user = user_entry.data[0]
    hashed_password = user['password']

    if not check_password(password, hashed_password):
        return JsonResponse({'error': 'Incorrect password'}, status=401)
    supabase.table("user_sessions").delete().eq("email", email).execute()

    from django.utils.timezone import now
    session_result = supabase.table("user_sessions").insert({
        "email": email,
        "created_at": now().isoformat()
    }).execute()

    if not session_result.data:
        return JsonResponse({'error': 'Login succeeded, but session creation failed'}, status=500)

    session_id = session_result.data[0]["session_id"]

    return JsonResponse({'message': 'Login successful', 'session_id': session_id}, status=200)


@csrf_exempt
def forgot_password_view(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST allowed'}, status=405)
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    email = data.get('email')
    if not email:
        return JsonResponse({'error': 'Email is required'}, status=400)
    user_check = supabase.table("login").select("email").eq("email", email).execute()
    if not user_check.data:
        return JsonResponse({'error': 'Email not found'}, status=404)
    supabase.table("password_change_requests").delete().eq("email", email).execute()

    otp = generate_otp()
    result = supabase.table("password_change_requests").insert({
        "email": email,
        "otp": otp,
        "created_at": now().isoformat()
    }).execute()
    if not result.data:
        return JsonResponse({'error': 'Failed to save OTP'}, status=500)
    try:
        send_mail(
            subject='Your OTP to Reset Your Password',
            message=f'Your OTP for password reset is: {otp}\nThis OTP will expire in 10 minutes.',
            from_email=os.getenv("EMAIL_HOST_USER"),
            recipient_list=[email],
            fail_silently=False,
        )
    except Exception as e:
        print("Email error:", e)
        return JsonResponse({'error': 'Failed to send OTP email'}, status=500)
    return JsonResponse({'message': 'OTP sent to your email. It will expire in 10 minutes.'}, status=200)

@csrf_exempt
def reset_password_view(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    email = data.get('email')
    otp = data.get('otp')
    new_password = data.get('new_password')
    confirm_password = data.get('confirm_password')

    if not all([email, otp, new_password, confirm_password]):
        return JsonResponse({'error': 'All fields are required'}, status=400)

    if new_password != confirm_password:
        return JsonResponse({'error': 'Passwords do not match'}, status=400)

    if len(new_password) < 8 or not re.search(r'[A-Z]', new_password) or not re.search(r'\W', new_password):
        return JsonResponse({'error': 'Password must be at least 8 characters, include a capital letter and a special character'}, status=400)
    request_entry = supabase.table("password_change_requests").select("*").eq("email", email).execute()
    if not request_entry.data:
        return JsonResponse({'error': 'No OTP request found for this email'}, status=404)

    record = request_entry.data[0]
    if record['otp'] != otp:
        return JsonResponse({'error': 'Incorrect OTP'}, status=401)
    created_at = datetime.fromisoformat(record['created_at'].replace("Z", "+00:00"))
    if (now() - created_at).total_seconds() > 600:
        return JsonResponse({'error': 'OTP expired'}, status=403)
    hashed_password = make_password(new_password)
    update_result = supabase.table("login").update({"password": hashed_password}).eq("email", email).execute()
    if not update_result.data:
        return JsonResponse({'error': 'Failed to update password'}, status=500)
    supabase.table("password_change_requests").delete().eq("email", email).execute()
    return JsonResponse({'message': 'Password reset successfully'}, status=200)

load_dotenv()
SUPABASE_PROJECT = os.getenv("SUPABASE_URL").split("//")[1]
DEFAULT_PICTURE = "https://{}/storage/v1/object/public/profile/default-avatar.png".format(SUPABASE_PROJECT)
@csrf_exempt
def upload_profile_picture_view(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST method allowed'}, status=405)
    session_id = request.POST.get('session_id')
    image = request.FILES.get('image')
    if not session_id or not image:
        return JsonResponse({'error': 'session_id and image are required'}, status=400)
    session_lookup = supabase.table("user_sessions").select("email").eq("session_id", session_id).execute()
    if not session_lookup.data:
        return JsonResponse({'error': 'Invalid or expired session'}, status=403)

    email = session_lookup.data[0]["email"]
    user = supabase.table("login").select("id").eq("email", email).execute()
    if not user.data:
        return JsonResponse({'error': 'User not found'}, status=404)
    ext = image.name.split('.')[-1]
    filename = f"profile/{uuid.uuid4()}.{ext}"
    try:
        supabase.storage.from_('profile').upload(filename, image.read(), {
            "content-type": image.content_type
        })
    except Exception as e:
        return JsonResponse({'error': f'Upload failed: {str(e)}'}, status=500)
    public_url = f"https://{SUPABASE_PROJECT}.supabase.co/storage/v1/object/public/{filename}"
    result = supabase.table("login").update({
        "picture": public_url
    }).eq("email", email).execute()

    if not result.data:
        return JsonResponse({'error': 'Failed to update login record'}, status=500)

    return JsonResponse({
        "message": "Profile picture updated successfully",
        "url": public_url
    }, status=200)


@csrf_exempt
def remove_profile_picture_view(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST allowed'}, status=405)
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    session_id = data.get('session_id')
    if not session_id:
        return JsonResponse({'error': 'Session ID is required'}, status=400)
    session_entry = supabase.table("user_sessions").select("email").eq("session_id", session_id).execute()
    if not session_entry.data:
        return JsonResponse({'error': 'Invalid or expired session'}, status=403)
    email = session_entry.data[0]["email"]
    user_entry = supabase.table("login").select("picture").eq("email", email).execute()
    if not user_entry.data:
        return JsonResponse({'error': 'User not found'}, status=404)
    user = user_entry.data[0]
    picture_url = user.get('picture')
    project_url = os.getenv("SUPABASE_URL").split("//")[1]
    default_picture_url = f"https://{project_url}/storage/v1/object/public/profilepicture/default-avatar.png"
    if picture_url and picture_url != default_picture_url:
        try:
            filename = picture_url.split("/profile/")[1]
            supabase.storage.from_('profile').remove([f"profile/{filename}"])
        except Exception as e:
            print("Warning: failed to delete old image:", e)
    update = supabase.table("login").update({
        "picture": default_picture_url
    }).eq("email", email).execute()
    if not update.data:
        return JsonResponse({'error': 'Failed to reset profile picture'}, status=500)

    return JsonResponse({'message': 'Profile picture removed and reset to default'}, status=200)


@csrf_exempt
def upload_wardrobe_item_view(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    session_id = request.POST.get('session_id')
    category = request.POST.get('category', '')
    image = request.FILES.get('image')

    if not session_id or not image:
        return JsonResponse({'error': 'Session ID and image are required'}, status=400)

    # Get user email from session
    session_entry = supabase.table("user_sessions").select("email").eq("session_id", session_id).execute()
    if not session_entry.data:
        return JsonResponse({'error': 'Invalid or expired session'}, status=403)

    email = session_entry.data[0]['email']

    # Generate file path
    ext = image.name.split('.')[-1]
    filename = f"wardrobe1/{email}/{uuid.uuid4()}.{ext}"

    try:
        supabase.storage.from_('wardrobe1').upload(filename, image.read(), {
            "content-type": image.content_type
        })
    except Exception as e:
        return JsonResponse({'error': f'Upload failed: {str(e)}'}, status=500)

    public_url = f"https://{os.getenv('SUPABASE_URL').split('//')[1]}/storage/v1/object/public/{filename}"

    # Insert into wardrobe table
    result = supabase.table("wardrobe").insert({
        "email": email,
        "image_url": public_url,
        "category": category
    }).execute()

    if not result.data:
        return JsonResponse({'error': 'Failed to save wardrobe item in DB'}, status=500)

    return JsonResponse({'message': 'Item added to wardrobe', 'item': result.data[0]}, status=201)


@csrf_exempt
def remove_wardrobe_item_view(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    session_id = data.get('session_id')
    item_id = data.get('id')

    if not session_id or not item_id:
        return JsonResponse({'error': 'Session ID and item ID are required'}, status=400)

    # Get email from session
    session_entry = supabase.table("user_sessions").select("email").eq("session_id", session_id).execute()
    if not session_entry.data:
        return JsonResponse({'error': 'Invalid or expired session'}, status=403)

    email = session_entry.data[0]['email']

    # Fetch item to get image_url
    entry = supabase.table("wardrobe").select("image_url").eq("email", email).eq("id", item_id).execute()
    if not entry.data:
        return JsonResponse({'error': 'Wardrobe item not found'}, status=404)

    image_url = entry.data[0]["image_url"]
    filename = image_url.split("/wardrobe1/")[1]

    # Delete image from storage
    try:
        supabase.storage.from_("wardrobe1").remove([f"wardrobe1/{filename}"])
    except Exception as e:
        print("Warning: storage delete failed", e)

    # Delete from wardrobe table
    supabase.table("wardrobe").delete().eq("email", email).eq("id", item_id).execute()

    return JsonResponse({'message': 'Wardrobe item removed'}, status=200)


@csrf_exempt
def view_wardrobe_items_view(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    session_id = data.get('session_id')
    if not session_id:
        return JsonResponse({'error': 'Session ID is required'}, status=400)

    # Get email from session
    session_entry = supabase.table("user_sessions").select("email").eq("session_id", session_id).execute()
    if not session_entry.data:
        return JsonResponse({'error': 'Invalid or expired session'}, status=403)

    email = session_entry.data[0]['email']

    # Fetch wardrobe items
    result = supabase.table("wardrobe").select("*").eq("email", email).order("uploaded_at", desc=True).execute()

    if not result.data:
        return JsonResponse({'items': []}, status=200)

    # Optional: Validate image URL points to wardrobe1 bucket
    for item in result.data:
        if not item["image_url"].startswith("https://") or "wardrobe1" not in item["image_url"]:
            item["image_url"] = f"https://{os.getenv('SUPABASE_URL').split('//')[1]}/storage/v1/object/public/wardrobe1/{item['image_url'].split('/wardrobe1/')[-1]}"

    return JsonResponse({'items': result.data}, status=200)

@csrf_exempt
def show_profile_view(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    session_id = data.get('session_id')
    if not session_id:
        return JsonResponse({'error': 'Session ID is required'}, status=400)

    # Fetch email from session
    session_entry = supabase.table("user_sessions").select("email").eq("session_id", session_id).execute()
    if not session_entry.data:
        return JsonResponse({'error': 'Invalid or expired session'}, status=403)

    email = session_entry.data[0]['email']

    # Fetch user info
    user = supabase.table("login").select("first_name", "last_name", "picture").eq("email", email).execute()
    if not user.data:
        return JsonResponse({'error': 'User not found'}, status=404)

    user_data = user.data[0]
    full_name = f"{user_data['first_name']} {user_data['last_name']}"
    picture = user_data.get("picture")

    return JsonResponse({
    'name': full_name,
    'email': email,
    'picture': picture
}, status=200)


@csrf_exempt
def update_profile_name_view(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    session_id = data.get('session_id')
    first_name = data.get('first_name')
    last_name = data.get('last_name')

    if not session_id or not first_name or not last_name:
        return JsonResponse({'error': 'Session ID, first name, and last name are required'}, status=400)

    # Get email from session
    session_entry = supabase.table("user_sessions").select("email").eq("session_id", session_id).execute()
    if not session_entry.data:
        return JsonResponse({'error': 'Invalid or expired session'}, status=403)

    email = session_entry.data[0]['email']

    # Update name in login table
    result = supabase.table("login").update({
        "first_name": first_name,
        "last_name": last_name
    }).eq("email", email).execute()

    if not result.data:
        return JsonResponse({'error': 'Failed to update name'}, status=500)

    return JsonResponse({'message': 'Name updated successfully'}, status=200)

from django.contrib.auth.hashers import check_password, make_password

@csrf_exempt
def change_password_view(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    session_id = data.get('session_id')
    old_password = data.get('old_password')
    new_password = data.get('new_password')
    confirm_password = data.get('confirm_password')

    if not all([session_id, old_password, new_password, confirm_password]):
        return JsonResponse({'error': 'All fields are required'}, status=400)

    # Get email from session
    session_entry = supabase.table("user_sessions").select("email").eq("session_id", session_id).execute()
    if not session_entry.data:
        return JsonResponse({'error': 'Invalid or expired session'}, status=403)

    email = session_entry.data[0]['email']

    # Get current hashed password
    user = supabase.table("login").select("password").eq("email", email).execute()
    if not user.data:
        return JsonResponse({'error': 'User not found'}, status=404)

    hashed_password = user.data[0]['password']

    # Check old password
    if not check_password(old_password, hashed_password):
        return JsonResponse({'error': 'Old password is incorrect'}, status=401)

    # Validate new password
    if len(new_password) < 8 or not re.search(r'[A-Z]', new_password) or not re.search(r'\W', new_password):
        return JsonResponse({'error': 'New password must be at least 8 characters and include one uppercase and one special character'}, status=400)

    if new_password != confirm_password:
        return JsonResponse({'error': 'New passwords do not match'}, status=400)

    # Hash and update new password
    new_hashed = make_password(new_password)
    result = supabase.table("login").update({
        "password": new_hashed
    }).eq("email", email).execute()

    if not result.data:
        return JsonResponse({'error': 'Failed to update password'}, status=500)

    return JsonResponse({'message': 'Password changed successfully'}, status=200)

@csrf_exempt
def search_by_name_view(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    session_id = data.get('session_id')
    name = data.get('name')

    if not session_id or not name:
        return JsonResponse({'error': 'Session ID and product name are required'}, status=400)

    # Get email from session
    session_entry = supabase.table("user_sessions").select("email").eq("session_id", session_id).execute()
    if not session_entry.data:
        return JsonResponse({'error': 'Invalid or expired session'}, status=403)

    # No need to use email for this search, just validate session
    result = supabase.table("products").select("*").ilike("name", f"%{name}%").execute()

    return JsonResponse({'results': result.data}, status=200)

@csrf_exempt
def search_by_store_view(request):
    data = json.loads(request.body)
    email = data.get('email')
    store = data.get('store')

    if not email or not store:
        return JsonResponse({'error': 'Email and store name are required'}, status=400)

    result = supabase.table("products").select("*").eq("store", store).execute()

    return JsonResponse({'results': result.data}, status=200)

@csrf_exempt
def search_by_store_view(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    session_id = data.get('session_id')
    store = data.get('store')

    if not session_id or not store:
        return JsonResponse({'error': 'Session ID and store name are required'}, status=400)

    # Validate session
    session_entry = supabase.table("user_sessions").select("email").eq("session_id", session_id).execute()
    if not session_entry.data:
        return JsonResponse({'error': 'Invalid or expired session'}, status=403)

    # Perform store search
    result = supabase.table("products").select("*").eq("store", store).execute()

    return JsonResponse({'results': result.data}, status=200)

@csrf_exempt
def filter_by_category_view(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    session_id = data.get('session_id')
    category = data.get('category')  # "top" or "bottom"
    subtype = data.get('subtype')    # optional
    gender = data.get('gender')      # "mens" or "womens"

    if not session_id or not category:
        return JsonResponse({'error': 'Session ID and category are required'}, status=400)

    session_entry = supabase.table("user_sessions").select("email").eq("session_id", session_id).execute()
    if not session_entry.data:
        return JsonResponse({'error': 'Invalid or expired session'}, status=403)

    query = supabase.table("products").select("*").eq("type", category)

    if subtype:
        query = query.eq("subtype", subtype)
    if gender:
        query = query.eq("gender", gender)

    result = query.execute()
    return JsonResponse({'results': result.data}, status=200)

@csrf_exempt
def sort_by_price_view(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    email = data.get('email')
    order = data.get('order')  # "high" or "low"

    if not email or order not in ['high', 'low']:
        return JsonResponse({'error': 'Email and valid order required'}, status=400)

    result = supabase.table("products").select("*").order("price", desc=(order == 'high')).execute()

    return JsonResponse({'results': result.data}, status=200)

@csrf_exempt
def advanced_search_view(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    session_id = data.get('session_id')
    name = data.get('name')
    store = data.get('store')
    category = data.get('category')  # "top", "bottom"
    subtype = data.get('subtype')    # e.g., "t-shirt"
    gender = data.get('gender')      # "mens", "womens"
    order = data.get('order')        # "high" or "low" (optional)

    if not session_id:
        return JsonResponse({'error': 'Session ID is required'}, status=400)

    # Validate session
    session_entry = supabase.table("user_sessions").select("email").eq("session_id", session_id).execute()
    if not session_entry.data:
        return JsonResponse({'error': 'Invalid or expired session'}, status=403)

    # Build product query
    query = supabase.table("products").select("id, name, price, images, url")  # Explicitly select image_url and url fields

    if name:
        query = query.ilike("name", f"%{name}%")
    if store:
        query = query.eq("store", store)
    if category:
        query = query.eq("type", category)
    if subtype:
        query = query.eq("subtype", subtype)
    if gender:
        query = query.eq("gender", gender)
    if order in ['high', 'low']:
        query = query.order("price", desc=(order == "high"))

    result = query.execute()

    return JsonResponse({'results': result.data}, status=200)



@csrf_exempt
def suggest_match_view(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    try:
        session_id = request.POST.get('session_id')
        if not session_id:
            return JsonResponse({'error': 'Session ID is required'}, status=400)

        # Validate session
        session_entry = supabase.table("user_sessions").select("email").eq("session_id", session_id).execute()
        if not session_entry.data:
            return JsonResponse({'error': 'Invalid or expired session'}, status=403)

        if 'image' not in request.FILES:
            return JsonResponse({'error': 'No image file provided'}, status=400)

        uploaded_file = request.FILES['image']
        temp_dir = os.path.join(os.getcwd(), "temp")
        os.makedirs(temp_dir, exist_ok=True)

        path = os.path.join(temp_dir, uploaded_file.name)
        with open(path, "wb+") as f:
            for chunk in uploaded_file.chunks():
                f.write(chunk)

        # Import and use AI function
        from ai.match_items import suggest_matching_items
        results = suggest_matching_items(path, opposite_type="bottom")  # default "bottom", or dynamic

        return JsonResponse({'results': results}, status=200)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
def find_similar_view(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    try:
        session_id = request.POST.get('session_id')
        if not session_id:
            return JsonResponse({'error': 'Session ID is required'}, status=400)

        session_entry = supabase.table("user_sessions").select("email").eq("session_id", session_id).execute()
        if not session_entry.data:
            return JsonResponse({'error': 'Invalid or expired session'}, status=403)

        if 'image' not in request.FILES:
            return JsonResponse({'error': 'No image file provided'}, status=400)

        uploaded_file = request.FILES['image']
        temp_dir = os.path.join(os.getcwd(), "temp")
        os.makedirs(temp_dir, exist_ok=True)
        path = os.path.join(temp_dir, uploaded_file.name)

        with open(path, "wb+") as f:
            for chunk in uploaded_file.chunks():
                f.write(chunk)

        from ai.similar_product import find_similar_products
        results = find_similar_products(path)

        return JsonResponse({'results': results}, status=200)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

    
@csrf_exempt
def trendy_outfits_view(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    try:
        data = json.loads(request.body)
        session_id = data.get("session_id")
        gender = data.get("gender", "mens")

        if not session_id:
            return JsonResponse({'error': 'Session ID is required'}, status=400)

        session_entry = supabase.table("user_sessions").select("email").eq("session_id", session_id).execute()
        if not session_entry.data:
            return JsonResponse({'error': 'Invalid or expired session'}, status=403)

        from ai.trendy_outfits import get_trendy_outfits
        outfits = get_trendy_outfits(gender)

        return JsonResponse({'outfits': outfits}, status=200)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)



@csrf_exempt
def wardrobe_outfits_view(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    try:
        data = json.loads(request.body)
        session_id = data.get("session_id")

        if not session_id:
            return JsonResponse({'error': 'Session ID is required'}, status=400)

        session_entry = supabase.table("user_sessions").select("email").eq("session_id", session_id).execute()
        if not session_entry.data:
            return JsonResponse({'error': 'Invalid or expired session'}, status=403)

        email = session_entry.data[0]["email"]

        from ai.wardrobe_outfits import generate_outfits_from_wardrobe
        result = generate_outfits_from_wardrobe(email)

        if "error" in result:
            return JsonResponse({"error": result["error"]}, status=400)

        return JsonResponse(result, status=200)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)



@csrf_exempt
def recommend_wardrobe_view(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    try:
        data = json.loads(request.body)
        session_id = data.get("session_id")

        if not session_id:
            return JsonResponse({'error': 'Session ID is required'}, status=400)

        session_entry = supabase.table("user_sessions").select("email").eq("session_id", session_id).execute()
        if not session_entry.data:
            return JsonResponse({'error': 'Invalid or expired session'}, status=403)

        email = session_entry.data[0]["email"]

        from ai.recommend_fill_wardrobe import recommend_for_wardrobe
        result = recommend_for_wardrobe(email)

        if "error" in result:
            return JsonResponse({'error': result["error"]}, status=400)

        return JsonResponse(result, status=200)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def logout_view(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    session_id = data.get('session_id')
    if not session_id:
        return JsonResponse({'error': 'Session ID is required'}, status=400)

    # Verify session
    session_entry = supabase.table("user_sessions").select("email").eq("session_id", session_id).execute()
    if not session_entry.data:
        return JsonResponse({'error': 'Invalid or expired session'}, status=403)

    # Delete the session
    supabase.table("user_sessions").delete().eq("session_id", session_id).execute()

    return JsonResponse({'message': 'Logout successful'}, status=200)


