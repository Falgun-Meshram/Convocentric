import json
from rest_framework import status
from django.test import TestCase, Client
from django.urls import reverse
from ..models import User
from ..serializers import UserSerializer
from django.contrib.auth.hashers import make_password
from ..utils import get_token

# initialize the APIClient app
client = Client()

class GetAllUsers(TestCase):
    """ Test module for GET all users API """

    def setUp(self):

        username_list = ['test1', 'test2', 'test3', 'test4']
        email_address_list = ['test1@test.com', 'test2@test.com', 'test3@test.com', 'test4@test.com']
        raw_password_list = ['Testing123!', 'Testing456!', 'Testing789!', 'Testing012!']
        password_list = []
        for password in raw_password_list:
            password_obj = make_password(password)
            password_list.append(password_obj)

        users = []

        # CREATE YOUR USERS
        for i in range(4):
            post_data = dict(username=username_list[i], email=email_address_list[i], password=raw_password_list[i])
            serializer_data = UserSerializer(data=post_data)
            if serializer_data.is_valid():
                serializer_data.save()
                users.append(serializer_data)
        
        post_data = dict(username='test1', email='test1@test.com', password='Testing123!')

        self.serializer = users[0]

        self.token = get_token(self, client, post_data, self.serializer)
        self.headers = {'HTTP_AUTHORIZATION': 'Token ' + self.token}

    def test_get_all_users(self):
        # get API response
        response = client.get(reverse('get_all_users'), **self.headers)
        # get data from db
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        self.assertEqual(response.data['users'], serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class GetSingleUserTest(TestCase):
    """ Test module for GET single user API """

    def setUp(self):

        post_data = dict(username='test5', email='test5@test.com', password='Testing100!')

        self.serializer = UserSerializer(data=post_data)

        if self.serializer.is_valid():
            self.serializer.save()

        self.token = get_token(self, client, post_data, self.serializer)
        self.headers = {'HTTP_AUTHORIZATION': 'Token ' + self.token}

    def test_get_valid_single_user(self):
        response = client.get(
            reverse('manage_user', kwargs={'pk': self.serializer.data['id']}), **self.headers)
        user = User.objects.get(pk=self.serializer.data['id'])
        serializer = UserSerializer(user)
        self.assertEqual(response.data['user'], serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_invalid_single_user(self):
        response = client.get(
            reverse('manage_user', kwargs={'pk': 30}), **self.headers)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class CreateNewUserTest(TestCase):
    """ Test module for inserting a new user """
    
    def setUp(self):

        self.valid_payload = {
            'username': 'test9',
            'email': 'test9@test.com',
            'password': 'Testing104!',
        }

        self.invalid_payload = {
            'username': '',
            'email': 'test10@test.com',
            'password': 'Testing105!',
        }

    def test_create_user(self):
        response = client.post(
            reverse('signup'),
            data=json.dumps(self.valid_payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_invalid_user(self):
        response = client.post(
            reverse('signup'),
            data=json.dumps(self.invalid_payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class UpdateSingleUserTest(TestCase):
    """ Test module for updating an existing user record """

    def setUp(self):

        post_data = dict(username='test11', email='test11@test.com', password='Testing106!')

        self.serializer = UserSerializer(data=post_data)

        if self.serializer.is_valid():
            self.serializer.save()

        self.valid_payload = {
            'username': 'test13',
            'email': 'test13@test.com',
            'password': 'Testing108!',
        }

        self.invalid_payload = {
            'username': '',
            'email': 'test14@test.com',
            'password': 'Testing109!',
        }
        
        self.token = get_token(self, client, post_data, self.serializer)

        self.headers = {'HTTP_AUTHORIZATION': 'Token ' + self.token}

    def test_valid_update_user(self):
        response = client.put(
            reverse('manage_user', kwargs={'pk': self.serializer.data['id']}),
            data=json.dumps(self.valid_payload),
            content_type='application/json',
            **self.headers
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_invalid_update_user(self):
        response = client.put(
            reverse('manage_user', kwargs={'pk': self.serializer.data['id']}),
            data=json.dumps(self.invalid_payload),
            content_type='application/json', 
            **self.headers
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class DeleteSingleUserTest(TestCase):
    """ Test module for deleting an existing user record """

    def setUp(self):

        post_data = dict(username='test15', email='test15@test.com', password='Testing110!')

        self.serializer = UserSerializer(data=post_data)

        if self.serializer.is_valid():
            self.serializer.save()

        self.token = get_token(self, client, post_data, self.serializer)
        
        self.headers = {'HTTP_AUTHORIZATION': 'Token ' + self.token}

    def test_valid_delete_user(self):
        
        response = client.delete(
            reverse('manage_user', kwargs={'pk': self.serializer.data['id']}), **self.headers)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_invalid_delete_user(self):
        response = client.delete(
            reverse('manage_user', kwargs={'pk': 30}), **self.headers)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)