from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.conf import settings
from django.utils.translation import gettext_lazy as _

AUTH_USER_MODEL = getattr(settings, "AUTH_USER_MODEL", "auth.User")

class User(AbstractUser):

    first_name = models.CharField(max_length=50, null=True, default=None)
    last_name = models.CharField(max_length=50, null=True, default=None)
    email = models.EmailField(_('email address'), unique=True, null=False)
    created_on = models.DateTimeField(default=timezone.now())
    updated_on = models.DateTimeField(default=timezone.now())
    profile_picture = models.TextField(null=True, default='', blank=True)
    last_passwords = models.TextField(null=True)
    locked = models.BooleanField(null=True)
    last_login = models.DateTimeField(null=True)
    username = models.CharField(max_length=50, unique=True, null=False, default='')

    REQUIRED_FIELDS = []

    def get_username(self):
        return self.username
        
    def __str__(self):
        return self.email

class Country(models.Model):

    name = models.CharField(max_length=80, null=False, default='')

class Notification(models.Model):

    message = models.TextField(blank=False, default='')
    created_on = models.DateTimeField(default=timezone.now())
    type = models.CharField(blank=False, max_length=20, default='')
    read = models.BooleanField(default=False)
    user = models.ForeignKey(User, related_name='notifications', on_delete=models.CASCADE, default=None)

class Chat(models.Model):
    participants = models.ManyToManyField(User, related_name='chats', blank=True)
    messages = models.ManyToManyField('backend.Message', related_name='message_chat', blank=True, default=None)

    def __str__(self):
        return "{}".format(self.pk)

class Message(models.Model):
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    chat = models.ForeignKey(Chat, related_name='chat_messages', on_delete=models.CASCADE, default=None)
    user = models.ForeignKey(User, related_name='user_messages', on_delete=models.CASCADE, default=None)
