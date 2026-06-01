from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Wishlist
from .serializer import WishlistSerializer
from accounts.permissions import IsOwnerOrReadOnly

class WishlistViewSet(viewsets.ModelViewSet):
    """
    ViewSet for saving properties to user wishlists.
    Enforces that users can only manage their own wishlists.
    """
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        # Extremely secure: A user can ONLY view their own wishlist items.
        if self.request.user.role == 'ADMIN':
            return Wishlist.objects.all().order_by('-added_at')
        return Wishlist.objects.filter(user=self.request.user).order_by('-added_at')

    def perform_create(self, serializer):
        # Automatically assign the wishlist item to the authenticated user
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        # Prevent duplicate wishlist additions cleanly
        property_id = request.data.get('property')
        if Wishlist.objects.filter(user=request.user, property_id=property_id).exists():
            return Response(
                {"error": "This property is already in your wishlist."},
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().create(request, *args, **kwargs)
