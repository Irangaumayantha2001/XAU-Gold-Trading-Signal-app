from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class PriceResponse(BaseModel):
    symbol: str
    bid: float
    ask: float
    timestamp: datetime
    
    class Config:
        from_attributes = True

class SignalResponse(BaseModel):
    id: int
    symbol: str
    signal_type: str
    entry_price: float
    stop_loss: float
    take_profit_1: float
    take_profit_2: Optional[float]
    take_profit_3: Optional[float]
    confidence: float
    reasoning: Optional[str]
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class SignalCreate(BaseModel):
    symbol: str = "XAUUSD"
    signal_type: str
    entry_price: float
    stop_loss: float
    take_profit_1: float

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class FCMTokenUpdate(BaseModel):
    fcm_token: str