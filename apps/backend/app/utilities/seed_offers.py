from sqlmodel import SQLModel, Session, create_engine

from app.core.config import settings
from app.models.models import BingwaOffer, OfferCategory

# 1. Engine
engine = create_engine(settings.database_url, echo=False)

# 2. Flattened seed data
offer_seed_list = [
    # DATA OFFERS
    {"label": "1GB", "validity": "1HR", "price": 19, "category": OfferCategory.data},
    {"label": "250MB", "validity": "24HRS", "price": 20, "category": OfferCategory.data},
    {"label": "2GB", "validity": "1HR", "price": 31, "category": OfferCategory.data},
    {"label": "350 MB", "validity": "7DAYS", "price": 49, "category": OfferCategory.data},
    {"label": "1.5GB", "validity": "3HOURS", "price": 50, "category": OfferCategory.data},
    {"label": "1.25GB", "validity": "Till Midnight", "price": 55, "category": OfferCategory.data},
    {"label": "1GB", "validity": "24HRS", "price": 99, "category": OfferCategory.data},


    {"label": "1.2GB", "validity": "30DAYS", "price": 250, "category": OfferCategory.data},
    {"label": "2.5 GB", "validity": "7DAYS", "price": 300, "category": OfferCategory.data},
    {"label": "2.5 GB", "validity": "30DAYS", "price": 500, "category": OfferCategory.data},
    {"label": "6.5 GB", "validity": "7DAYS", "price": 700, "category": OfferCategory.data},
    {"label": "10 GB", "validity": "30DAYS", "price": 1001, "category": OfferCategory.data},
    {"label": "1.5 GB", "validity": "3HRS", "price": 50, "category": OfferCategory.data},
    {"label": "1 GB", "validity": "1HOUR", "price": 23, "category": OfferCategory.data},
    {"label": "2 GB", "validity": "24HRS", "price": 105, "category": OfferCategory.data},

    # SMS OFFERS
    {"label": "20 SMS", "validity": "1DAY", "price": 5, "category": OfferCategory.sms},
    {"label": "200 SMS", "validity": "1DAY", "price": 10, "category": OfferCategory.sms},
    {"label": "100 SMS", "validity": "7DAYS", "price": 21, "category": OfferCategory.sms},
    {"label": "1000SMS", "validity": "7DAYS", "price": 30, "category": OfferCategory.sms},
    {"label": "1500 SMS", "validity": "30DAYS", "price": 101, "category": OfferCategory.sms},
    {"label": "3500 SMS", "validity": "30DAYS", "price": 201, "category": OfferCategory.sms},
    {"label": "UNLIMITED SMS", "validity": "DAILY", "price": 25, "category": OfferCategory.sms},
    {"label": "UNLIMITED SMS", "validity": "WEEKLY", "price": 54, "category": OfferCategory.sms},

    # MINUTES OFFERS
    {"label": "20MINS/50 KREDO", "validity": "TILL MIDNIGHT", "price": 22, "category": OfferCategory.minutes},
    {"label": "30MINS", "validity": "3HOURS", "price": 26, "category": OfferCategory.minutes},
    {"label": "50 MINS", "validity": "TILL MIDNIGHT", "price": 51, "category": OfferCategory.minutes},
    {"label": "150 KREDO", "validity": "TILL MIDNIGHT", "price": 56, "category": OfferCategory.minutes},
    {"label": "300 MINS", "validity": "30DAYS", "price": 499, "category": OfferCategory.minutes},
    {"label": "800 MINS", "validity": "30DAYS", "price": 1000, "category": OfferCategory.minutes},

    # MINUTES+DATA OFFER
    {"label": "8GB+", "validity": "400MINUTES", "price": 999, "product_id": "034",
     "category": OfferCategory.minutes_plus_data},
]


# 3. Refactored seeder
def seed_offers(session: Session) -> int:
    """
    Seed offers into the database if they don't already exist.
    Returns the number of inserted records.
    """
    # Fetch existing IDs once

    # Filter out already-present
    new_offers = [
        BingwaOffer(**data)
        for data in offer_seed_list
    ]

    session.add_all(new_offers)
    session.commit()
    return len(new_offers)


if __name__ == "__main__":
    # Create tables
    # SQLModel.metadata.create_all(engine)

    # Seed
    with Session(engine) as session:
        count = seed_offers(session)
        print(f"✅ Seeded {count} new offer(s).")
