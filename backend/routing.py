from django.urls import re_path
# from django.conf.urls import url

from convocentric import consumers
# from . import consumers

websocket_urlpatterns = [
    # re_path(r'^ws/chat/(?P<room_name>[^/]+)/$', consumers.Consumer.as_asgi()),
    # re_path(r'^ws/(?P<room_name>\w+)/$', consumers.Consumer.as_asgi()),
    re_path(r'^ws/chat/(?P<room_name>\w+)/$',
            consumers.ChatConsumer.as_asgi()),
    re_path(r'^ws/(?P<room_name>\w+)/$', consumers.ChatConsumer.as_asgi()),


]
