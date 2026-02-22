from fastapi import FastAPI
import sys
import os

app = FastAPI()

@app.get("/api/test")
@app.get("/test")
@app.get("/")
def test():
    try:
        ls_cwd = os.listdir('.')
    except:
        ls_cwd = "unavailable"
    return {
        "status": "minimal app works",
        "python_version": sys.version,
        "cwd": os.getcwd(),
        "ls_cwd": ls_cwd,
        "env": {k: v for k, v in os.environ.items() if "KEY" not in k and "SECRET" not in k}
    }
