from supabase import create_client
import os
import random

supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

def generate_outfits_from_wardrobe(email, count=5):
    result = supabase.table("wardrobe").select("product_id").eq("email", email).execute()
    wardrobe_items = result.data

    if not wardrobe_items:
        return {"error": "Wardrobe is empty"}

    product_ids = [item["product_id"] for item in wardrobe_items]

    products = supabase.table("products").select("id, name, type, subtype, url, images").in_("id", product_ids).execute().data

    tops = [p for p in products if p["type"] == "top"]
    bottoms = [p for p in products if p["type"] == "bottom"]

    if not tops:
        return {"error": "No tops found in wardrobe"}
    if not bottoms:
        return {"error": "No bottoms found in wardrobe"}

    outfits = []
    for _ in range(count):
        top = random.choice(tops)
        bottom = random.choice(bottoms)
        outfits.append({
            "top": top,
            "bottom": bottom
        })

    return {"outfits": outfits}
