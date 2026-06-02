from django.urls import path
from .views import register, me, GoogleLogin, EmailTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path(
        'register/',
        register,
        name='register'
    ),
    path(
        'login/',
        EmailTokenObtainPairView.as_view(),
        name='token_obtain_pair'
    ),
    path(
        'me/',
        me,
        name='me'
    ),
    path(
        'refresh/',
        TokenRefreshView.as_view(),
        name='token_refresh'
    ),
    path(
        'google/login/',
        GoogleLogin.as_view(),
        name='google_login'
    ),
]