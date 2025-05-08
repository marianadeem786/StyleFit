from ai.utils import get_image_embedding
from supabase import create_client
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import os

supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

def find_similar_products(image_path, top_k=5):
    result = supabase.table("products").select("id, name, url, images, embedding").execute()
    products = [p for p in result.data if p.get("embedding")]

    input_emb = get_image_embedding(image_path)

    import ast
    all_embeddings = np.array([
        ast.literal_eval(p['embedding']) if isinstance(p['embedding'], str) else p['embedding']
        for p in products
    ])

    similarities = cosine_similarity([input_emb], all_embeddings)[0]
    top_matches = sorted(zip(products, similarities), key=lambda x: x[1], reverse=True)

    return [match[0] for match in top_matches[:top_k]]

