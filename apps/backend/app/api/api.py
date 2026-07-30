from fastapi import APIRouter
from .routes import  users, login,  communications,  payments,mpesa_transactions, admin, bingwa, contacts, sms, loyalty

api_router = APIRouter()
admin_router = APIRouter()

api_router.include_router(admin.router, prefix='/admin', tags=['Admin Tools'])
api_router.include_router(login.router, prefix='/auth', tags=['Authentication'])
api_router.include_router(users.router, prefix='/users', tags=['Users'])
api_router.include_router(payments.router, prefix='/payments', tags=['Payments'])
api_router.include_router(loyalty.router, prefix='/loyalty')

api_router.include_router(contacts.router, prefix='/contacts', tags=['Contacts Management'])
api_router.include_router(communications.router, prefix='/communications', tags=['Communication'])
api_router.include_router(sms.router, prefix='/sms', tags=['Bulk Sms'])
api_router.include_router(bingwa.router, prefix='/bingwa', tags=['Bingwa offers'])
api_router.include_router(mpesa_transactions.router, prefix='/transactions', tags=['M-Pesa Transactions'])