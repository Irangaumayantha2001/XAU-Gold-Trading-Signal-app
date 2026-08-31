from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text
from database import Base
from datetime import datetime

class PriceData(Base):
    __tablename__ = "prices"
    id = Column(Integer, primary_key=True)
    symbol = Column(String, default="XAUUSD")
    bid = Column(Float, nullable=False)
    ask = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

class Signal(Base):
    __tablename__ = "signals"
    id = Column(Integer, primary_key=True)
    symbol = Column(String, default="XAUUSD")
    signal_type = Column(String, nullable=False)
    entry_price = Column(Float, nullable=False)
    stop_loss = Column(Float, nullable=False)
    take_profit_1 = Column(Float, nullable=False)
    take_profit_2 = Column(Float, nullable=True)
    take_profit_3 = Column(Float, nullable=True)
    confidence = Column(Float, default=0.0)
    reasoning = Column(Text, nullable=True)
    status = Column(String, default="active")
    created_at = Column(DateTime, default=datetime.utcnow)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    is_active = Column(Boolean, default=True)
    fcm_token = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)