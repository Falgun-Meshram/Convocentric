from django.test import TestCase
from ..models import User
from django.contrib.auth.hashers import make_password

class UserTest(TestCase):
    """ Test module for User model """

    def setUp(self):
        
        self.user_1 = User.objects.create(
            username='test11', email='test11@test.com', password=make_password('Testing106!'))
            
        self.user_2 = User.objects.create(
            username='test12', email='test12@test.com', password=make_password('Testing107!'))

        self.valid_payload = {
            'username': 'test11',
            'email': 'test11@test.com',
            'password': make_password('Testing106!'),
        }

        self.invalid_payload = {
            'username': 'test12',
            'email': 'test12@test.com',
            'password': make_password('Testing107!'),
        }

    def test_user_username(self):
        user_1 = User.objects.get(username='test11')
        user_2 = User.objects.get(username='test12')
        self.assertEqual(
            user_1.get_username(), user_1.username)
        self.assertEqual(
            user_2.get_username(), user_2.username)