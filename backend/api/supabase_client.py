from supabase import create_client
import os

# Load from .env if you're using it
from dotenv import load_dotenv
load_dotenv()

# Fetch environment variables
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Safety check
if not SUPABASE_URL or not SUPABASE_KEY:
    raise Exception("SUPABASE_URL and SUPABASE_KEY must be set as environment variables.")

# Create client
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
