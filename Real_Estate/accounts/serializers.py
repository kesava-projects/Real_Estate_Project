from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'phone', 'role')


class UserDetailsSerializer(serializers.ModelSerializer):
    """dj-rest-auth profile read/update (PUT/PATCH /accounts/user/)."""

    class Meta:
        model = User
        fields = ('pk', 'username', 'email', 'phone', 'role')
        read_only_fields = ('pk', 'email', 'role')


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Accept email + password for JWT login (maps email to username internally)."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["email"] = serializers.EmailField()
        self.fields.pop("username", None)

    def validate(self, attrs):
        email = attrs.pop("email")
        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            raise serializers.ValidationError(
                "No active account found with the given credentials"
            )
        attrs["username"] = user.username
        data = super().validate(attrs)
        data["user"] = UserProfileSerializer(self.user).data
        return data

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