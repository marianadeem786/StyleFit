import torch
import open_clip
from PIL import Image

# Load CLIP model and preprocessing
device = "cuda" if torch.cuda.is_available() else "cpu"

model, _, preprocess = open_clip.create_model_and_transforms(
    'ViT-B-32', pretrained='laion2b_s34b_b79k'
)
model.to(device)
model.eval()

def get_image_embedding(image_path):
    """
    Takes an image path and returns its 512-d embedding using CLIP.
    """
    image = Image.open(image_path).convert("RGB")
    image_tensor = preprocess(image).unsqueeze(0).to(device)
    
    with torch.no_grad():
        embedding = model.encode_image(image_tensor)

    return embedding.cpu().numpy().flatten().tolist()
