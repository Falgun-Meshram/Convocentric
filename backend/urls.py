from django.urls import path
from .views import *
from rest_framework.authtoken.views import ObtainAuthToken 

urlpatterns = [
    
    path('get_token/', ObtainAuthToken.as_view(), name="get_token"),
    path('login/', login_method, name="login"),  
    path('logout/', logout_method, name="logout"),
    path('manage_user/<int:pk>/', manage_user, name="manage_user"),
    path('signup/', signup, name="signup"),
    path('get_all_users/', get_all_users, name="get_all_users")

]