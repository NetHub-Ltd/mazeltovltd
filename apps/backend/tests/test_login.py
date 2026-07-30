from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings

client = TestClient(app=app)
url = '/api/v1/auth/access-token'


def test_successful_login():
    response = client.post(url,
                           data={'username': settings.admin_email, 'password': settings.admin_password})

    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()['token_type'] == 'bearer'
#
#
# # Negative Cases
# def test_unsuccessful_login():
#     response = client.post(url,
#                            params={'email': 'test@user.com', 'password': 'password'})
#     assert response.status_code == 401
#     assert response.json()['detail'] == 'wrong username or password'
#
#
# def test_missing_password():
#     response = client.post(url, params={'email': 'admin@admin.com'})
#     assert response.status_code == 422
#     assert response.json()['detail'][0]['loc'][1] == 'password'
#     assert response.json()['detail'][0]['msg'] == 'Field required'
#
#
# def test_user_not_exist():
#     response = client.post(url,
#                            params={"email": 'test@user.com', 'password': 'safaricom'})
#     assert response.status_code == 404
#     assert response.json()['detail'] == 'user not found'
#
#
# def test_sql_injection():
#     response = client.post(url,
#                            params={'email': 'DROP TABLE USER', 'password': 'test_password'})
#     assert response.status_code == 422
#     assert response.json()['detail'][0]['loc'][1] == 'email'
#     assert response.json()['detail'][0]['type'] == 'value_error'
