from fastapi import FastAPI

app = FastAPI(title="XAU Signals API")

@app.get("/")
def home():
    return {"message": "Server is running", "status": "ok"}

@app.get("/health")
def health():
    return {"status": "healthy"}