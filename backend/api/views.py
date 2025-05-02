from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from .supabase_client import supabase
from .utils import generate_otp
import json
import re
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
    session_result = supabase.table("user_sessions").insert({
        "email": email,
        "created_at": now().isoformat()
    }).execute()
    if not session_result.data:
        return JsonResponse({'error': 'Login succeeded, but session creation failed'}, status=500)

    return JsonResponse({'message': 'Login successful'}, status=200)

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
    email = request.POST.get('email')
    image = request.FILES.get('image')
    if not email or not image:
        return JsonResponse({'error': 'Email and image are required'}, status=400)
    user = supabase.table("login").select("*").eq("email", email).execute()
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

    public_url = f"https://{SUPABASE_PROJECT}/storage/v1/object/public/{filename}"

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
    email = data.get('email')
    if not email:
        return JsonResponse({'error': 'Email is required'}, status=400)
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
