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
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    try:
        data = json.loads(request.body)  # ✅ Handle JSON input
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    email = data.get('email')
    password = data.get('password')
    confirm_password = data.get('confirm_password')
    first_name = data.get('first_name')
    last_name = data.get('last_name')

    if not all([email, password, confirm_password, first_name, last_name]):
        return JsonResponse({'error': 'All fields are required'}, status=400)

    if len(password) < 8 or not re.search(r'[A-Z]', password) or not re.search(r'\W', password):
        return JsonResponse({'error': 'Password must be at least 8 characters long and include one uppercase and one special character.'}, status=400)

    if password != confirm_password:
        return JsonResponse({'error': 'Passwords do not match'}, status=400)

    existing = supabase.table("signup").select("*").eq("email", email).execute()
    if existing.data:
        return JsonResponse({'error': 'Email already registered'}, status=400)

    otp = generate_otp()

    result = supabase.table("signup").insert({
        "email": email,
        "password": password,
        "confirm_password": confirm_password,
        "first_name": first_name,
        "last_name": last_name,
        "otp": otp
    }).execute()

    if result.status_code != 201:
        return JsonResponse({'error': 'Could not save data to Supabase'}, status=500)

    send_mail(
        subject='Your OTP for StyleFit Signup',
        message=f'Your OTP is: {otp}',
        from_email=os.getenv("EMAIL_HOST_USER"),
        recipient_list=[email],
        fail_silently=False,
    )

    return JsonResponse({'message': 'Signup successful. OTP sent to your email.'}, status=201)
