import datetime
import random
import string
from accounts.models import CustomUser, ResetPassword, UserToken
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import exceptions
from rest_framework_simplejwt.tokens import RefreshToken

from accounts.serializers import UserSerializer
from accounts.authentication import JWTAuth
from accounts.utils import send_email


class CheckUserEmail(APIView):
    """
    Check email is used or not.
    """

    def post(self, request):
        data = request.data

        user = CustomUser.objects.filter(email=data['email']).first()
        if not user:
            return Response({'available': True})
        raise exceptions.ValidationError("Email is already in use.")


class RegisterAPIView(APIView):
    def post(self, request):
        data = request.data

        if data['password'] != data['password_confirmation']:
            raise exceptions.APIException('Passwords do not match')

        serializer = UserSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)


class LoginAPIView(APIView):
    def post(self, request):
        data = request.data

        user = CustomUser.objects.filter(email=data['email']).first()

        if not user:
            raise exceptions.AuthenticationFailed('Invalid credentials')

        if not user.check_password(data['password']):
            raise exceptions.AuthenticationFailed('Invalid credentials')
        auth = JWTAuth()
        token = auth.get_tokens_for_user(user)
        access_token = token['access']
        refresh_token = token['refresh']
        UserToken.objects.create(
            user=user,
            token=token['refresh'],
            expired_at=datetime.datetime.now() + datetime.timedelta(days=7)
        )

        response = Response()
        # response.set_cookie(key='refresh_token',
        #                     value=refresh_token,
        #                     httponly=True)
        response.data = {'access_token': access_token,
                         'refresh_token': refresh_token}

        return response


class IsAuthenticated(APIView):
    authentication_classes = [JWTAuth]

    def post(self, request):
        refresh_token = request.data.get('refresh_token')
        if not refresh_token:
            raise exceptions.NotAuthenticated(
                'Session expired! Please login again')

        refresh = RefreshToken(refresh_token)
        user_id = refresh['user_id']
        if not user_id:
            raise exceptions.NotAuthenticated('Unauthenticated')

        # Check if the refresh token is valid
        if not UserToken.objects.filter(
            user__id=user_id,
            token=refresh_token,
            expired_at__gte=datetime.datetime.now(datetime.timezone.utc)
        ).exists():
            raise exceptions.AuthenticationFailed(
                'Session expired! Please login again')

        user = CustomUser.objects.filter(id=user_id).first()
        if not user:
            raise exceptions.AuthenticationFailed('Unauthenticated')
        return Response({'authenticated': True, 'email': user.email})


class UserAPIView(APIView):
    authentication_classes = [JWTAuth]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response({'data': serializer.data})


class RefreshAPIView(APIView):
    def post(self, request):
        # refresh_token = request.COOKIES.get('refresh_token')
        refresh_token = request.data.get('refresh_token')
        if not refresh_token:
            raise exceptions.AuthenticationFailed(
                'Session expired! Please login again')

        refresh = RefreshToken(refresh_token)
        user_id = refresh['user_id']
        if not user_id:
            raise exceptions.AuthenticationFailed('Unauthenticated')

        # Check if the refresh token is valid
        if not UserToken.objects.filter(
            user__id=user_id,
            token=refresh_token,
            expired_at__gte=datetime.datetime.now(datetime.timezone.utc)
        ).exists():
            raise exceptions.AuthenticationFailed(
                'Session expired! Please login again')

        user = CustomUser.objects.filter(id=user_id).first()
        auth = JWTAuth()
        token = auth.get_tokens_for_user(user)
        access_token = token['access']
        refresh_token = token['refresh']

        # Delete old token
        UserToken.objects.filter(token=refresh_token).delete()
        # Create new token
        UserToken.objects.create(
            user=user,
            token=token['refresh'],
            expired_at=datetime.datetime.now() + datetime.timedelta(days=7)
        )

        response = Response()
        # Set new refresh token to cookie
        # response.set_cookie(key='refresh_token',
        #                     value=token['refresh'],
        #                     httponly=True)
        response.data = {'access_token': access_token,
                         'refresh_token': refresh_token}

        return response


class LogoutAPIView(APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')
        UserToken.objects.filter(token=refresh_token).delete()
        response = Response()
        # response.delete_cookie(key='refresh_token')
        response.data = {'message': 'Logged out'}
        return response


class PasswordChangeAPIView(APIView):
    authentication_classes = [JWTAuth]

    def post(self, request):
        data = request.data
        user = request.user
        if data['new_password'] != data['password_confirmation']:
            raise exceptions.APIException('Passwords do not match')
        if not user.check_password(data['old_password']):
            raise exceptions.AuthenticationFailed('Invalid credentials')
        user.set_password(data['new_password'])
        user.save()
        return Response({'message': 'Password changed'})


class PasswordForgotAPIView(APIView):
    def post(self, request):
        email = request.data['email']
        TOKEN = ''.join(random.choice(string.ascii_lowercase +
                        string.digits) for _ in range(20))

        user = CustomUser.objects.filter(email=email).first()
        if not user:
            raise exceptions.APIException('Email not registered')

        SUBJECT = 'Password Reset Link'
        MESSAGE = '''
            <p>Hi {},</p>
            <p>You have requested to reset your password. Please click the link below to reset your password:</p>
            <p><a href="http://localhost:4200/reset-password/{}">Reset Password</a></p>
            <p>If you did not make this request, please ignore this email.</p>
        '''.format(user.first_name, TOKEN)

        ResetPassword.objects.create(
            email=request.data['email'],
            token=TOKEN
        )
        result = send_email(SUBJECT, MESSAGE, email, NAME=user.first_name)

        return Response({'message': 'Check your email for reset link'})


class PasswordResetAPIView(APIView):
    def post(self, request):
        token = request.data.get('token')
        password = request.data.get('password')
        password_confirmation = request.data.get('password_confirmation')

        if password != password_confirmation:
            raise exceptions.APIException('Passwords do not match')
        reset = ResetPassword.objects.filter(token=token).first()
        if not reset:
            raise exceptions.APIException('Invalid link')

        user = CustomUser.objects.filter(email=reset.email).first()
        user.set_password(password)
        user.save()

        ResetPassword.objects.filter(token=token).delete()

        return Response({'message': 'Password reset successfully'})
