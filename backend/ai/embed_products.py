import open_clip
import torch
from PIL import Image
from torchvision import transforms
from supabase import create_client
import requests
from io import BytesIO
import numpy as np
from dotenv import load_dotenv
import os
import time

load_dotenv() 
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# 🔁 Setup CLIP model
device = "cuda" if torch.cuda.is_available() else "cpu"
model, _, preprocess = open_clip.create_model_and_transforms('ViT-B-32', pretrained='laion2b_s34b_b79k')
model.to(device)
model.eval()

def generate_embedding(image_url):
    try:
        response = requests.get(image_url, timeout=10)
        image = Image.open(BytesIO(response.content)).convert("RGB")
        image_tensor = preprocess(image).unsqueeze(0).to(device)
        with torch.no_grad():
            embedding = model.encode_image(image_tensor)
        return embedding.cpu().numpy().flatten()
    except Exception as e:
        print(f"❌ Failed to process image: {image_url} — {e}")
        return None

def update_products_with_embeddings(min_id=997, max_id=1627):
    print(f"📥 Fetching products with IDs from {min_id} to {max_id}...")
    result = supabase.table("products").select("id, images").gte("id", min_id).lte("id", max_id).execute()
    products = result.data

    for product in products:
        try:
            product_id = product["id"]
            image_urls = product.get("images", [])

            if not image_urls:
                print(f"⏭ Skipping product {product_id} — no images found")
                continue

            all_embeddings = []
            for url in image_urls:
                emb = generate_embedding(url)
                if emb is not None:
                    all_embeddings.append(emb)
                time.sleep(0.1)  # prevent rate limit

            if not all_embeddings:
                print(f"⚠ No valid embeddings for product {product_id}")
                continue

            avg_embedding = np.mean(all_embeddings, axis=0).tolist()

            supabase.table("products").update({
                "embedding": avg_embedding
            }).eq("id", product_id).execute()

            print(f"✅ Embedded product {product_id} ({len(all_embeddings)} images)")

        except Exception as e:
            print(f"❌ Error embedding product {product.get('id')}: {e}")

if __name__ == "__main__":
    update_products_with_embeddings(min_id=997, max_id=1627)
