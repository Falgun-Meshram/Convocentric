from django.shortcuts import get_object_or_404
from .models import User, Chat


def get_last_10_messages(chat_id):
    chat = get_object_or_404(Chat, id=chat_id)
    return chat.chat_messages.order_by('-timestamp').all()[:10]


def get_user(user_id):
    user = get_object_or_404(User, pk=user_id)
    return user


def get_current_chat(chat_id):
    return get_object_or_404(Chat, id=chat_id)


def create_new_chat(data):

    chat = Chat()
    chat.save()
    sender = get_user(data['senderId'])
    reciever = get_user(data['recieverId'])
    chat.participants.add(sender)
    chat.participants.add(reciever)
    
    return chat.id
