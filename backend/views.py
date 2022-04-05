from email import message
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User, Chat
from .serializers import UserSerializer, ChatSerializer
from django.contrib.auth import authenticate, login, logout
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from rest_framework import permissions, status
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token

# LOGIN
@api_view(["POST"])
@permission_classes([AllowAny])
def login_method(request):

    post_data = request.data
    username = post_data['username']
    password = post_data['password']
    user = authenticate(request, username=username, password=password)
    if user:
        login(request, user)
        token, created = Token.objects.get_or_create(user=user)
        user_serializer = UserSerializer(user)
        return Response({'ok':True, 'token': token.key, 'user': user_serializer.data})
    else:
        return Response({'ok': False, 'error': 'Invalid Credentials' })
        
# LOGOUT  
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def logout_method(request):
    logout(request)
    return Response({'ok': True})

# CREATE USER
@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):

    # insert a new record for a user
    if request.method == 'POST':
        post_data = request.data
        serializer = UserSerializer(data=post_data)
        if serializer.is_valid():
            serializer.save()
            return Response({ 'ok': True }, status=status.HTTP_201_CREATED)
        return Response({ 'ok': False, 'error': serializer.errors }, status=status.HTTP_400_BAD_REQUEST)

# AUTHENTICATION
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def is_authenticated(request):

    if request.user.is_authenticated:
        return Response({'ok': True})
    else:
        Response({'ok': False}) 

# GET, UPDATE, DELETE SINGLE USER
@api_view(['GET', 'DELETE', 'PUT'])
@permission_classes([IsAuthenticated])
def manage_user(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    # get details of a single user
    if request.method == 'GET':
        serializer = UserSerializer(user)
        return Response({'ok': True, 'user': serializer.data})

    # update details of a single user
    if request.method == 'PUT':
        post_data = request.data
        serializer = UserSerializer(user, data=post_data)
        if serializer.is_valid():
            serializer.save()
            return Response({ 'ok': True, 'user': request.data }, status=status.HTTP_204_NO_CONTENT)
        return Response({ 'ok': False, 'error': serializer.errors }, status=status.HTTP_400_BAD_REQUEST)

    # delete a single user
    if request.method == 'DELETE':
        user.delete()
        return Response({ 'ok': True }, status=status.HTTP_204_NO_CONTENT)

# GET ALL USERS
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_users(request):

    # get all users
    all_users = []
    if request.method == 'GET':
        current_user_id = request.user.id
        users = User.objects.exclude(pk=current_user_id)
        for user_obj in users:
            user_chats = user_obj.chats.all()
            user_data = UserSerializer(user_obj, many=False).data
            for chat_obj in user_chats:
                messages = chat_obj.chat_messages.order_by('-timestamp').all()[:1]
                last_message = None
                if len(messages) > 0:
                    last_message = messages[0].content
                chat_serializer = ChatSerializer(chat_obj, many=False).data
                participants = chat_serializer['participants']
                if current_user_id in participants:
                    user_data['chatId'] = chat_serializer['id']
                    user_data['last_message'] = last_message
            all_users.append(user_data)

        return Response({'ok':True, 'users': all_users})


# DELETE ALL CHATS
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_all_chats(request):

    chats = Chat.objects.all()
    for chat_obj in chats:
        chat_obj.participants.clear()

    Chat.objects.all().delete()
    return Response({'ok':True })