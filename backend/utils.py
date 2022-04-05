from turtle import pos
from rest_framework import status
from django.urls import reverse

def get_token(self, client, post_data, serializer):

    response = client.post(
        reverse("get_token"), {"username": serializer.data["username"], "password": post_data['password']}, format="json"
    )

    self.assertEqual(response.status_code, status.HTTP_200_OK)

    self.assertTrue("token" in response.data)

    token = response.data["token"] if "token" in response.data else ''
    
    return token
