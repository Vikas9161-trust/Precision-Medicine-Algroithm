import sys
import os
from fastapi import FastAPI

# Add the project root and backend directory to sys.path
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(root_dir)
sys.path.append(os.path.join(root_dir, "backend"))

debug_app = FastAPI()

@debug_app.get("/api/debug")
def debug():
    return {"status": "api/index.py is running", "python_path": sys.path, "root_dir": root_dir}

try:
    from backend.app.main import app
except Exception as e:
    import traceback
    error_msg = str(e)
    error_traceback = traceback.format_exc()
    
    @debug_app.get("/api/error")
    def error():
        return {"error": error_msg, "traceback": error_traceback}
    
    @debug_app.get("/api/test")
    def test():
        return {"status": "debug_app is working"}
        
    app = debug_app
