import datetime
import email
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer
from django.contrib.auth import authenticate, login, logout
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status

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
        return Response({'ok': True, 'error': None })
    else:
        return Response({'ok': False, 'error': 'Invalid credentials'})
        
# LOGOUT  
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def logout_method(request):
    logout(request)
    return Response({'ok': True})

# CREATE USER
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def manage_users(request):
    
    if request.method == 'POST':        
        post_data = request.data
        print(post_data)
        serializer = UserSerializer(data=post_data)
        if serializer.is_valid():
            serializer.save()
            return Response({ 'ok': True }, status=status.HTTP_201_CREATED)
        else:
            return Response({'ok': False, 'error': serializer.errors })

# MODIFY USER
@api_view(['POST'])
@permission_classes([AllowAny])
def edit_profile(request):
    
    if request.method == 'POST':        
        post_data = request.data
        try:
            user = User.objects.get(username=post_data['userName'])
            user.first_name = post_data['firstName']
            user.last_name = post_data['lastName']
            user.email = post_data['email']
            user.username = post_data['userName']
            user.save()
            return Response({ 'ok': True, 'user': post_data })
        except User.DoesNotExist:
            return Response({'ok': False, 'error': 'User does not exist.' })