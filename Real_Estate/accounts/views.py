from rest_framework.decorators import api_view, throttle_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.throttling import AnonRateThrottle
from rest_framework.permissions import AllowAny

from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView

from .serializers import RegisterSerializer

class AuthRegisterThrottle(AnonRateThrottle):
    scope = 'auth'

@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([AuthRegisterThrottle])
def register(request):
    serializer = RegisterSerializer(
        data=request.data
    )

    if serializer.is_valid():
        serializer.save()

        return Response({
            "message": "Registered Successfully"
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GoogleLogin(SocialLoginView):
    """
    Exposes an OAuth 2.0 Google authentication endpoint.
    Expects access_token or code in POST payload.
    Exchanges it for JWT authentication tokens.
    """
    adapter_class = GoogleOAuth2Adapter
    client_class = OAuth2Client
    callback_url = 'http://localhost:8000/accounts/google/callback/'
    permission_classes = [AllowAny]
    throttle_classes = [AuthRegisterThrottle]