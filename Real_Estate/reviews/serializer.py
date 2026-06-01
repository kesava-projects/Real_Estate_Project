from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = Review
        fields = (
            'id',
            'property',
            'user',
            'user_username',
            'user_email',
            'rating',
            'comment',
            'created_at'
        )
        read_only_fields = ('user', 'created_at')