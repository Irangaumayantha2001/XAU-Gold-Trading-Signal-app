from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class PriceCreate(BaseModel):
    symbol: str = "XAUUSD"
    bid: float
    ask: float


class PriceResponse(BaseModel):
    id: int
    symbol: str
    bid: float
    ask: float
    timestamp: datetime

    class Config:
        from_attributes = True


class SignalCreate(BaseModel):
    symbol: str = "XAUUSD"
    signal_type: str

    entry_price: float
    stop_loss: float

    take_profit_1: float
    take_profit_2: Optional[float] = None
    take_profit_3: Optional[float] = None

    confidence: float = Field(
        default=0.0,
        ge=0,
        le=100,
    )

    reasoning: Optional[str] = None


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


class FirebaseUserCreate(BaseModel):
    firebase_uid: str
    email: EmailStr
    full_name: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    firebase_uid: str
    email: EmailStr
    full_name: Optional[str]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class FCMTokenUpdate(BaseModel):
    fcm_token: str


class MessageResponse(BaseModel):
    message: str