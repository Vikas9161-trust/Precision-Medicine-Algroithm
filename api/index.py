import os
import sys
from fastapi import FastAPI

# Explicitly set up the path before any other imports
current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.dirname(current_dir)
backend_dir = os.path.join(root_dir, "backend")

sys.path.insert(0, root_dir)
sys.path.insert(0, backend_dir)

app = FastAPI()

@app.get("/api/test")
def test_endpoint():
    return {
        "status": "diagnostic app",
        "sys_path": sys.path,
        "backend_dir_exists": os.path.exists(backend_dir),
        "root_dir_exists": os.path.exists(root_dir)
    }

try:
    # Try to import from backend.app.main (which requires root_dir in sys.path)
    # or from app.main (which requires backend_dir in sys.path)
    from backend.app.main import app as main_app
    app = main_app
except Exception as e:
    import traceback
    error_info = {"error": str(e), "traceback": traceback.format_exc()}
    @app.get("/api/error")
    def error_endpoint():
        return error_info
