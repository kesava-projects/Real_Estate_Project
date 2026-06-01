from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User

class RegisterSerializer(serializers.ModelSerializer):

    class Meta:
        model = User

        fields = (
            'id',
            'username',
            'email',
            'password',
            'phone',
            'role'
        )

        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }

    def validate_password(self, value):
        validate_password(value)
        return value

    def create(self, validated_data):

        password = validated_data.pop('password')

        user = User(**validated_data)

        user.set_password(password)

        user.save()

        return user