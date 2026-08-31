from database import Base, engine

from models import PriceData, Signal, User


def create_tables():

    print("Creating database tables...")

    Base.metadata.create_all(bind=engine)

    print("Database tables created successfully!")


if __name__ == "__main__":
    create_tables()