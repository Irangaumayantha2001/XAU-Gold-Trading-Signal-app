from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from market_data import get_xau_price
from database import SessionLocal
from models import PriceData

app = FastAPI(
    title="XAU Signals API",
    version="1.0.0",
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


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
@app.get("/prices/live")
def live_xau_price(
    db: Session = Depends(get_db)
):
    try:
        data = get_xau_price()

        price = PriceData(
            symbol=data["symbol"],
            bid=data["price"],
            ask=data["price"],
        )

        db.add(price)
        db.commit()
        db.refresh(price)

        return data

    except Exception as e:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
    
@app.get("/prices/history")
def price_history(
    limit: int = 20,
    db: Session = Depends(get_db)
):
    prices = (
        db.query(PriceData)
        .order_by(PriceData.timestamp.desc())
        .limit(limit)
        .all()
    )

    return prices