from django.urls import path
from .views import signup_view, verify_otp_view, login_view,forgot_password_view,reset_password_view,upload_profile_picture_view,remove_profile_picture_view

urlpatterns = [
    path('signup/', signup_view, name='signup'),
    path('verify-otp/', verify_otp_view, name='verify_otp'),
    path('login/', login_view, name='login'),
    path('forgot_password/', forgot_password_view, name='forgot_password'),
    path('reset_password/', reset_password_view, name='reset_password'),
    path('upload_profile_picture/', upload_profile_picture_view, name='upload_profile_picture'),
    path('remove_profile_picture/', remove_profile_picture_view, name='remove_profile_picture')
]
