from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django.db.models import Q
from .models import Property, PropertyImage
from .serializer import PropertySerializer, PropertyImageSerializer
from accounts.permissions import IsAgentOrAdmin, IsPropertyAgentOrAdmin

class PropertyViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Property management, supporting search, filters, and role-based permissions.
    """
    queryset = Property.objects.all().order_by('-created_at')
    serializer_class = PropertySerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        elif self.action in ['create']:
            permission_classes = [IsAgentOrAdmin]
        else:
            # update, partial_update, destroy
            permission_classes = [IsPropertyAgentOrAdmin]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        # Automatically assign the logged-in user as the agent
        serializer.save(agent=self.request.user)

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filtering parameters
        property_type = self.request.query_params.get('property_type')
        listing_type = self.request.query_params.get('listing_type')
        bedrooms = self.request.query_params.get('bedrooms')
        bathrooms = self.request.query_params.get('bathrooms')
        city = self.request.query_params.get('city')
        state = self.request.query_params.get('state')
        price_min = self.request.query_params.get('price_min')
        price_max = self.request.query_params.get('price_max')
        search_query = self.request.query_params.get('search')

        if property_type:
            queryset = queryset.filter(property_type__iexact=property_type)
        if listing_type:
            queryset = queryset.filter(listing_type__iexact=listing_type)
        if bedrooms:
            queryset = queryset.filter(bedrooms=bedrooms)
        if bathrooms:
            queryset = queryset.filter(bathrooms=bathrooms)
        if city:
            queryset = queryset.filter(city__icontains=city)
        if state:
            queryset = queryset.filter(state__icontains=state)
        if price_min:
            queryset = queryset.filter(price__gte=price_min)
        if price_max:
            queryset = queryset.filter(price__lte=price_max)
        if search_query:
            queryset = queryset.filter(
                Q(title__icontains=search_query) |
                Q(description__icontains=search_query) |
                Q(address__icontains=search_query) |
                Q(city__icontains=search_query) |
                Q(state__icontains=search_query)
            )
            
        return queryset

class PropertyImageViewSet(viewsets.ModelViewSet):
    """
    ViewSet for PropertyImage gallery. Only listing owner/agent or admin can upload/delete.
    """
    queryset = PropertyImage.objects.all()
    serializer_class = PropertyImageSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        else:
            # create, update, destroy
            permission_classes = [IsPropertyAgentOrAdmin]
        return [permission() for permission in permission_classes]

    def create(self, request, *args, **kwargs):
        # Secure manual verification that the current agent owns the property they are adding images to.
        property_id = request.data.get('property')
        if not property_id:
            return Response({"error": "Property ID is required"}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            prop = Property.objects.get(pk=property_id)
        except Property.DoesNotExist:
            return Response({"error": "Property does not exist"}, status=status.HTTP_404_NOT_FOUND)
            
        # Ensure user is admin or the agent assigned to the property
        if request.user.role != 'ADMIN' and prop.agent != request.user:
            return Response(
                {"error": "You do not have permission to add images to this property listing."},
                status=status.HTTP_403_FORBIDDEN
            )
            
        return super().create(request, *args, **kwargs)
