from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView

from accounts.views import RegisterAPIView, LoginAPIView, UserAPIView, RefreshAPIView, LogoutAPIView, PasswordChangeAPIView, PasswordForgetAPIView, PasswordResetAPIView

urlpatterns = [
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('logout/', LogoutAPIView.as_view(), name='logout'),

    path('token/', TokenObtainPairView.as_view(), name='token'),
    path('token/login/', UserAPIView.as_view(), name='token_login'),
    path('token/refresh/', RefreshAPIView.as_view(), name='token_refresh'),

    path('password/change/', PasswordChangeAPIView.as_view(), name='password_change'),
    path('password/forget/', PasswordForgetAPIView.as_view(), name='password_forget'),
    path('password/reset/', PasswordResetAPIView.as_view(), name='password_reset'),
]
