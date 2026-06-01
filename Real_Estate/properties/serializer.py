from rest_framework import serializers
from .models import Property, PropertyImage
from accounts.models import User

class UserBriefSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'phone', 'role')

class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ('id', 'property', 'image')

class PropertySerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)
    agent = UserBriefSerializer(read_only=True)

    class Meta:
        model = Property
        fields = (
            'id',
            'title',
            'description',
            'price',
            'property_type',
            'listing_type',
            'bedrooms',
            'bathrooms',
            'area_sqft',
            'address',
            'city',
            'state',
            'pincode',
            'agent',
            'images',
            'created_at'
        )
        read_only_fields = ('agent', 'images', 'created_at')