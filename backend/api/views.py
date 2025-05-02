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
            subject='Your OTP for StyleFit Signup',
            message=f'Hello {first_name},\n\nYour OTP is: {otp}\n\nUse this to verify your account.',
            from_email=os.getenv("EMAIL_HOST_USER"),
            recipient_list=[email],
            fail_silently=False,
        )
    except Exception as e:
        print("Email sending failed:", e)
        return JsonResponse({'error': 'Signup saved but OTP email failed to send.'}, status=500)

    return JsonResponse({'message': 'Signup successful. OTP sent to your email.'}, status=201)
