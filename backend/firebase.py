import os

import firebase_admin
from firebase_admin import credentials
from firebase_admin import auth

from dotenv import load_dotenv

load_dotenv()


def initialize_firebase():

    if firebase_admin._apps:
        return

    service_account_path = os.getenv(
        "FIREBASE_SERVICE_ACCOUNT"
    )

    if not service_account_path:
        raise ValueError(
            "FIREBASE_SERVICE_ACCOUNT is not set in .env"
        )

    cred = credentials.Certificate(
        service_account_path
    )

    firebase_admin.initialize_app(cred)


def verify_firebase_token(id_token: str):

    initialize_firebase()

    decoded_token = auth.verify_id_token(id_token)

    return decoded_token