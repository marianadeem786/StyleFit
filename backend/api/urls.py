from django.urls import path
from .views import (
    signup_view, verify_otp_view, login_view, forgot_password_view, reset_password_view,
    upload_profile_picture_view, remove_profile_picture_view, view_wardrobe_items_view,
    remove_wardrobe_item_view, upload_wardrobe_item_view, show_profile_view, update_profile_name_view,
    change_password_view, search_by_name_view, search_by_store_view, filter_by_category_view,
    advanced_search_view, suggest_match_view, find_similar_view, trendy_outfits_view,wardrobe_outfits_view, recommend_wardrobe_view, logout_view
)

urlpatterns = [
    path('signup/', signup_view, name='signup'),
    path('verify-otp/', verify_otp_view, name='verify_otp'),
    path('login/', login_view, name='login'),
    path('forgot_password/', forgot_password_view, name='forgot_password'),
    path('reset_password/', reset_password_view, name='reset_password'),
    path('upload_profile_picture/', upload_profile_picture_view, name='upload_profile_picture'),
    path('remove_profile_picture/', remove_profile_picture_view, name='remove_profile_picture'),
    path('view_wardrobe_items/', view_wardrobe_items_view, name='view_wardrobe_items'),
    path('remove_wardrobe_item/', remove_wardrobe_item_view, name='remove_wardrobe_item'),
    path('upload_wardrobe_item/', upload_wardrobe_item_view, name='upload_wardrobe_item'),
    path('show_profile/', show_profile_view, name='show_profile'),
    path('update_profile_name/', update_profile_name_view, name='update_profile_name'),
    path("change_password_view/", change_password_view, name='change_password_view'),
    path("search_by_name_view/", search_by_name_view, name='search_by_name_view'),
    path("search_by_store_view/", search_by_store_view, name='search_by_store_view'),
    path("filter_by_category_view/", filter_by_category_view, name='filter_by_category_view'),
    path("advanced_search_view/", advanced_search_view, name='advanced_search_view'),
    path("suggest_match_view/", suggest_match_view, name='suggest_match_view'),
    path("find_similar_view/", find_similar_view, name='find_similar_view'),
    path("trendy_outfits_view/", trendy_outfits_view, name='trendy_outfits_view'),
    path("wardrobe_outfits_view/", wardrobe_outfits_view, name='wardrobe_outfits_view'),
    path("recommend_wardrobe_view/", recommend_wardrobe_view, name='recommend_wardrobe_view'),
    path("logout_view/", logout_view, name='logout_view')
]
