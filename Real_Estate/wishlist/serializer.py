from rest_framework import serializers
from .models import Wishlist
from properties.serializer import PropertySerializer

class WishlistSerializer(serializers.ModelSerializer):
    # Field to display nested property information in listing responses
    property_details = PropertySerializer(source='property', read_only=True)

    class Meta:
        model = Wishlist
        fields = ('id', 'user', 'property', 'property_details', 'added_at')
        read_only_fields = ('user', 'added_at')