from fastapi import FastAPI

app = FastAPI(
    title="XAU Signals API",
    version="1.0.0",
)


@app.get("/")
def home():
    return {
        "message": "XAU Signals API",
        "status": "ok",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
    }