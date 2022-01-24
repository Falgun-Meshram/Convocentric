import datetime
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer
from django.contrib.auth import authenticate, login, logout
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def login_method(request):
    # Login Logic
    return Response({'ok': True})

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def logout_method(request):
    # Logout Logic  
    return Response({'ok': True})
