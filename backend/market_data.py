
import os
import requests
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

ALPHA_VANTAGE_API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY")

if not ALPHA_VANTAGE_API_KEY:
    raise ValueError(
        "ALPHA_VANTAGE_API_KEY is not set in .env"
    )


def get_xau_price():
    url = "https://www.alphavantage.co/query"

    params = {
        "function": "GOLD_SILVER_SPOT",
        "symbol": "GOLD",
        "apikey": ALPHA_VANTAGE_API_KEY,
    }

    response = requests.get(
        url,
        params=params,
        timeout=15,
    )

    response.raise_for_status()

    data = response.json()

    print("ALPHA VANTAGE RESPONSE:", data)

    # Alpha Vantage returns the gold price in a field
    # depending on the API response format.
    price = (
        data.get("price")
        or data.get("data", [{}])[0].get("value")
    )

    if price is None:
        raise Exception(
            f"Could not find gold price in response: {data}"
        )

    return {
        "symbol": "XAUUSD",
        "price": float(price),
        "unit": None,
        "timestamp": datetime.utcnow().strftime(
            "%Y-%m-%d %H:%M:%S"
        ),
    }

