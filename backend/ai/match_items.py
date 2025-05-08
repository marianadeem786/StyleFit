from ai.utils import get_image_embedding
from supabase import create_client
from sklearn.metrics.pairwise import cosine_similarity
import os
import numpy as np

supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

def suggest_matching_items(image_path, opposite_type='bottom'):
    query = supabase.table("products").select("id, name, type, url, images, embedding").eq("type", opposite_type).execute()
    products = [p for p in query.data if p.get("embedding")]

    if not products:
        return []

    input_emb = get_image_embedding(image_path)
    all_embeddings = np.array([p['embedding'] for p in products])
    similarities = cosine_similarity([input_emb], all_embeddings)[0]

    top_matches = sorted(zip(products, similarities), key=lambda x: x[1], reverse=True)
    return [match[0] for match in top_matches[:5]]
