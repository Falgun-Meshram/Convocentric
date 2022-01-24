from .base import *
from decouple import config

ALLOWED_HOSTS = ['']

CORS_ORIGIN_WHITELIST = []

CSRF_COOKIE_SECURE = True

SESSION_COOKIE_SECURE = True

SECURE_SSL_REDIRECT = True

SECURE_SSL_HOST = config('SECURE_SSL_HOST')

SECURE_HSTS_SECONDS = 31536000

STATIC_URL = '/home/ubuntu/'

try:
    from .local import *
except:
    pass
