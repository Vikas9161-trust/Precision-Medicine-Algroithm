from fastapi import FastAPI
app = FastAPI()

@app.get("/api/test")
def test():
    return {"status": "minimal app works"}

@app.get("/api/debug")
def debug():
    import sys
    import os
    return {"sys.path": sys.path, "cwd": os.getcwd()}
