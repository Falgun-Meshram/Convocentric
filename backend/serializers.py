from email import message
from rest_framework import serializers
from .models import User, Chat, Message

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
    
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class MessageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Message
        fields = '__all__'

class ChatSerializer(serializers.ModelSerializer):
    participants = UserSerializer(many=True, read_only=True)
    message = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Chat
        fields = '__all__'

