from .base import *

NGROK = '25ab-2607-fea8-1c80-7f7-55ce-adce-4c03-481e.ngrok.io'

ALLOWED_HOSTS = ['127.0.0.1', 'localhost', NGROK]

CORS_ORIGIN_WHITELIST = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://25ab-2607-fea8-1c80-7f7-55ce-adce-4c03-481e.ngrok.io'
]

STATIC_URL = '/static/'

MEDIA_URL = '/media/'

try:
    from .local import *
except:
    pass