from django.urls import path
from .views import signup_view, verify_otp_view

urlpatterns = [
    path('signup/', signup_view, name='signup'),
    path('verify-otp/', verify_otp_view, name='verify_otp'),
]
