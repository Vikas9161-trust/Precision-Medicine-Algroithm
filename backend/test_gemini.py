
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
print(f"API Key found: {api_key[:5]}..." if api_key else "API Key NOT found")

if api_key:
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content("Hello, can you hear me?")
        print("✅ Gemini API Test Success!")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"❌ Gemini API Test Failed: {e}")
else:
    print("❌ Cannot test API without key.")
