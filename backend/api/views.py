from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from .supabase_client import supabase
from .utils import generate_otp
import json
import re
import os

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

from django.contrib.auth.hashers import make_password
from django.views.decorators.csrf import csrf_exempt

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
    saved_otp = user.get("otp")
    if otp_input != saved_otp:
        return JsonResponse({'error': 'Invalid OTP'}, status=401)
    hashed_password = make_password(user["password"])

    result = supabase.table("login").insert({
        "email": user["email"],
        "password": hashed_password,
        "first_name": user["first_name"],
        "last_name": user["last_name"],
        "picture": None  
    }).execute()

    if not result.data:
        return JsonResponse({'error': 'Failed to create login account'}, status=500)
    supabase.table("signup").delete().eq("email", email).execute()

    return JsonResponse({'message': 'OTP verified. Account created successfully.'}, status=200)

from django.contrib.auth.hashers import check_password
from django.views.decorators.csrf import csrf_exempt
import json
from datetime import datetime
from django.utils.timezone import now

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
    session_result = supabase.table("user_sessions").insert({
        "email": email,
        "created_at": now().isoformat()
    }).execute()

    if not session_result.data:
        return JsonResponse({'error': 'Login succeeded, but session creation failed'}, status=500)

    return JsonResponse({'message': 'Login successful'}, status=200)

