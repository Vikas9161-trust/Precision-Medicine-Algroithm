import os
import sys
from dotenv import load_dotenv

def check_health():
    print("--- Backend Health Check ---")
    
    # Check .env
    if os.path.exists(".env"):
        print("✅ .env file exists")
        load_dotenv(override=True)
    else:
        print("❌ .env file NOT FOUND")

    # Check API Key
    api_key = os.getenv("GEMINI_API_KEY")
    if api_key:
        print(f"✅ GEMINI_API_KEY found: {api_key[:4]}...{api_key[-4:]}")
    else:
        print("❌ GEMINI_API_KEY NOT found")

    # Check Database
    db_path = "pharmaguard.db"
    if os.path.exists(db_path):
        print(f"✅ Database file found: {db_path}")
    else:
        print(f"❌ Database file NOT FOUND: {db_path}")

    # Check Dependencies
    try:
        import fastapi
        import uvicorn
        import sqlmodel
        import google.generativeai
        print("✅ Core dependencies (fastapi, uvicorn, sqlmodel, google-generativeai) are installed")
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")

if __name__ == "__main__":
    check_health()
