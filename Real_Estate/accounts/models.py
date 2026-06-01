# Create your models here.
from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):

    ROLE_CHOICES = (
        ('ADMIN', 'Admin'),
        ('AGENT', 'Agent'),
        ('BUYER', 'Buyer')
    )

    PROVIDER_CHOICES = (
        ('LOCAL', 'Local'),
        ('GOOGLE', 'Google')
    )

    phone = models.CharField(
        max_length=15,
        blank=True,
        null=True
    )

    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES,
        default='BUYER'
    )

    provider = models.CharField(
        max_length=10,
        choices=PROVIDER_CHOICES,
        default='LOCAL'
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )