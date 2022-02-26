from django.urls import path
from .views import *

urlpatterns = [
    path('login/', login_method),  
    path('logout/', logout_method),
    path('signup/', manage_users),  
    path('edit_profile/', edit_profile)
]