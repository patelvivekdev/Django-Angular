from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView

from accounts.views import (
    CheckUserEmail,
    RegisterAPIView,
    LoginAPIView,
    UserAPIView,
    RefreshAPIView,
    LogoutAPIView,
    PasswordChangeAPIView,
    PasswordForgotAPIView,
    PasswordResetAPIView,
    IsAuthenticated)


urlpatterns = [
    path('check/email/', CheckUserEmail.as_view(), name='check_email'),
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('logout/', LogoutAPIView.as_view(), name='logout'),

    path('is-authenticated/', IsAuthenticated.as_view(), name='is_authenticated'),
    path('me/', UserAPIView.as_view(), name='user_me'),

    path('token/', TokenObtainPairView.as_view(), name='token'),
    path('token/refresh/', RefreshAPIView.as_view(), name='token_refresh'),

    path('password/change/', PasswordChangeAPIView.as_view(), name='password_change'),
    path('password/forgot/', PasswordForgotAPIView.as_view(), name='password_forgot'),
    path('password/reset/', PasswordResetAPIView.as_view(), name='password_reset'),
]
