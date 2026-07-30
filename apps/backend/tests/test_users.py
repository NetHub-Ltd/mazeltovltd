from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings

client = TestClient(app=app)
url = '/api/v1/users'


# Fetch
def test_get_products():
    pass


def test_get_user_by_id():
    pass


# Create User
def test_create_user():
    pass


# Update User
def test_update_user():
    pass

# Remove User
