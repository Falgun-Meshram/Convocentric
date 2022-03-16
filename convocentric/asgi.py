"""
ASGI config for convocentric project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/asgi/
"""

import os
from decouple import config
from django.core.asgi import get_asgi_application

if config('ENV') == 'dev':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'convocentric.settings.dev')
else:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'convocentric.settings.prod')


application = get_asgi_application()
