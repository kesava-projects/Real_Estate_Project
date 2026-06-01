from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Review
from .serializer import ReviewSerializer
from accounts.permissions import IsOwnerOrReadOnly

class ReviewViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Property Reviews.
    - Anyone can list/retrieve reviews.
    - Authenticated buyers/users can write a review.
    - Authors of reviews or admins can update or delete reviews.
    """
    queryset = Review.objects.all().order_by('-created_at')
    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        elif self.action in ['create']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            # update, partial_update, destroy
            permission_classes = [IsOwnerOrReadOnly]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = super().get_queryset()
        property_id = self.request.query_params.get('property')
        if property_id:
            queryset = queryset.filter(property_id=property_id)
        return queryset

    def perform_create(self, serializer):
        # Automatically assign the logged-in reviewer
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        # Enforce that a user can only write one review per property to prevent spam
        property_id = request.data.get('property')
        if Review.objects.filter(user=request.user, property_id=property_id).exists():
            return Response(
                {"error": "You have already reviewed this property listing."},
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().create(request, *args, **kwargs)
