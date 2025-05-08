from supabase import create_client
import os
import random

supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

def recommend_for_wardrobe(email, count=5):
    wardrobe_result = supabase.table("wardrobe").select("product_id").eq("email", email).execute()
    wardrobe_items = wardrobe_result.data

    if not wardrobe_items:
        return {"error": "Wardrobe is empty, please add some items first"}

    wardrobe_ids = [item["product_id"] for item in wardrobe_items]
    product_result = supabase.table("products").select("id, type, name, subtype, url, images").in_("id", wardrobe_ids).execute()
    wardrobe_products = product_result.data

    tops = [p for p in wardrobe_products if p["type"] == "top"]
    bottoms = [p for p in wardrobe_products if p["type"] == "bottom"]

    if len(tops) >= len(bottoms):
        missing_type = "bottom"
    else:
        missing_type = "top"

    # Recommend products the user does NOT already own
    all_products = supabase.table("products").select("id, name, type, subtype, url, images").eq("type", missing_type).execute().data
    new_items = [p for p in all_products if p["id"] not in wardrobe_ids]

    if not new_items:
        return {"error": f"No more {missing_type}s available to recommend."}

    suggestions = random.sample(new_items, min(count, len(new_items)))

    return {
        "missing_type": missing_type,
        "suggestions": suggestions
    }
