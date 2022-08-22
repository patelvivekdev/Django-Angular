from rest_framework import exceptions
from rest_framework.authentication import BaseAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken


class JWTAuth(BaseAuthentication):
    def authenticate(self, request):
        JWTauthentication = JWTAuthentication()

        header = JWTauthentication.get_header(request)
        if header is None:
            raise exceptions.AuthenticationFailed(
                'Invalid credentials!!. Please login again')

        raw_token = JWTauthentication.get_raw_token(header)
        if raw_token is None:
            raise exceptions.AuthenticationFailed(
                'Invalid credentials!!. Please login again')

        validated_token = JWTauthentication.get_validated_token(raw_token)
        user = JWTauthentication.get_user(validated_token)

        return (user, None)

    def get_tokens_for_user(self, user):
        refresh = RefreshToken.for_user(user)

        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
