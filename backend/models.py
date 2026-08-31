from datetime import datetime

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    Integer,
    String,
    Text,
)

from database import Base


class PriceData(Base):
    __tablename__ = "prices"

    id = Column(Integer, primary_key=True, index=True)

    symbol = Column(
        String,
        default="XAUUSD",
        nullable=False,
        index=True,
    )

    bid = Column(Float, nullable=False)
    ask = Column(Float, nullable=False)

    timestamp = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )


class Signal(Base):
    __tablename__ = "signals"

    id = Column(Integer, primary_key=True, index=True)

    symbol = Column(
        String,
        default="XAUUSD",
        nullable=False,
        index=True,
    )

    signal_type = Column(
        String,
        nullable=False,
    )

    entry_price = Column(Float, nullable=False)
    stop_loss = Column(Float, nullable=False)

    take_profit_1 = Column(Float, nullable=False)
    take_profit_2 = Column(Float, nullable=True)
    take_profit_3 = Column(Float, nullable=True)

    confidence = Column(
        Float,
        default=0.0,
    )

    reasoning = Column(
        Text,
        nullable=True,
    )

    status = Column(
        String,
        default="active",
        nullable=False,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    firebase_uid = Column(
        String,
        unique=True,
        nullable=False,
        index=True,
    )

    email = Column(
        String,
        unique=True,
        nullable=False,
        index=True,
    )

    full_name = Column(
        String,
        nullable=True,
    )

    is_active = Column(
        Boolean,
        default=True,
        nullable=False,
    )

    fcm_token = Column(
        String,
        nullable=True,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )