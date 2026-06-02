from rest_framework import serializers
from .models import ContactRequest
from properties.serializer import PropertySerializer

class ContactRequestSerializer(serializers.ModelSerializer):
    property_details = PropertySerializer(source='property', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)
    user_phone = serializers.CharField(source='user.phone', read_only=True)

    class Meta:
        model = ContactRequest
        fields = (
            'id',
            'user',
            'user_username',
            'user_email',
            'user_phone',
            'property',
            'property_details',
            'message',
            'created_at'
        )
        read_only_fields = ('user', 'created_at')