from datetime import datetime
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
import json
from backend.models import Message, Chat, User
from backend.socket_views import get_last_10_messages, get_user, get_current_chat, create_new_chat


class ChatConsumer(WebsocketConsumer):

    def fetch_messages(self, data):
        chat_id = data['chatId']
        messages = []
        is_created = False

        if data['chatId']:
            messages = get_last_10_messages(data['chatId'])
        else:
            chat_id = create_new_chat(data)
            is_created = True

        fetched_messages = self.messages_to_json(messages) if messages else []
        message_dict = {
            'fetched_messages': fetched_messages, 'chat_id': chat_id, 'recieverId': data['recieverId'], 'senderId': data['senderId']}

        content = {
            'command': 'messages',
            'isCreated': is_created,
            'messages': message_dict
        }
        if is_created:
            self.send_chat_message(content, 'fetch_messages_method')
        else:
            self.send_message(content)

    def new_message(self, data):
        user = get_user(data['senderId'])
        message = Message.objects.create(user=user, content=data['message'], timestamp=datetime.now(), chat_id=data['chatId'])
        current_chat = get_current_chat(data['chatId'])
        current_chat.chat_messages.add(message)
        current_chat.save()
        content = {
            'command': 'new_message',
            'message': self.message_to_json(message)
        }
        return self.send_chat_message(content, 'new_message_method')

    def is_online(self, data):
        content = {
                'command': 'is_online',
                'message':{
                    'status': data['status'], 
                    'userId': data['userId']
                }
            }
        return self.send_chat_message(content, 'is_online_method')

    def messages_to_json(self, messages):
        result = []
        for message in messages:
            result.append(self.message_to_json(message))
        return result

    def message_to_json(self, message):
        return {
            'id': message.id,
            'chat_id': message.chat.id,
            'author': message.user.username,
            'author_id': message.user.id,
            'content': message.content,
            'timestamp': str(message.timestamp)
        }

    commands = {
        'fetch_messages': fetch_messages,
        'new_message': new_message,
        'is_online': is_online
    }

    def connect(self):
        self.room_name = self.scope['url_route']['kwargs'].get('room_name', "global")
        self.room_group_name = 'chat_%s' % self.room_name
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def receive(self, text_data):
        data = json.loads(text_data)
        self.commands[data['command']](self, data)

    def send_chat_message(self, message, type):
        layer = self.channel_layer.group_send
        async_to_sync(layer)(
            self.room_group_name,
            {
                'type': type,
                'message': message
            }
        )

    def new_message_method(self, event):
        message = event['message']
        self.send(text_data=json.dumps(message))

    def fetch_messages_method(self, event):
        message = event['message']
        self.send(text_data=json.dumps(message))

    def is_online_method(self, event):
        message = event['message']
        self.send(text_data=json.dumps(message))

    def send_message(self, message):
        self.send(text_data=json.dumps(message))