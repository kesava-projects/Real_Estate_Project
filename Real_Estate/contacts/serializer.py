from rest_framework import serializers
from .models import ContactRequest, ContactReply
from properties.serializer import PropertySerializer


class ContactReplySerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source='sender.username', read_only=True)
    sender_role = serializers.CharField(source='sender.role', read_only=True)

    class Meta:
        model = ContactReply
        fields = (
            'id',
            'contact',
            'sender',
            'sender_username',
            'sender_role',
            'body',
            'created_at',
        )
        read_only_fields = ('contact', 'sender', 'created_at')


class ContactReplyCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactReply
        fields = ('body',)

class ContactRequestSerializer(serializers.ModelSerializer):
    property_details = PropertySerializer(source='property', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)
    user_phone = serializers.CharField(source='user.phone', read_only=True)
    replies = ContactReplySerializer(many=True, read_only=True)

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
            'replies',
            'created_at'
        )
        read_only_fields = ('user', 'created_at')