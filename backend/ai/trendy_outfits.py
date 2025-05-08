import random
from supabase import create_client
import os

supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

TRENDY_TOPS = ["t-shirt", "polo", "cropped", "shirt"]
TRENDY_BOTTOMS = ["cargo", "jeans", "chino", "wide pants"]

def get_trendy_outfits(gender="mens", count=5):
    top_query = supabase.table("products").select("id, name, type, subtype, url, images").eq("type", "top").eq("gender", gender).in_("subtype", TRENDY_TOPS).execute()
    bottom_query = supabase.table("products").select("id, name, type, subtype, url, images").eq("type", "bottom").eq("gender", gender).in_("subtype", TRENDY_BOTTOMS).execute()

    tops = top_query.data
    bottoms = bottom_query.data

    outfits = []
    for _ in range(count):
        top = random.choice(tops)
        bottom = random.choice(bottoms)
        outfits.append({
            "top": top,
            "bottom": bottom
        })

    return outfits
