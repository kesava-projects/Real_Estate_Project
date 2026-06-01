from django.db import models
from accounts.models import User

class Property(models.Model):

    PROPERTY_TYPES = (
        ('APARTMENT','APARTMENT'),
        ('VILLA','VILLA'),
        ('HOUSE','HOUSE'),
        ('LAND','LAND')
    )

    LISTING_TYPES = (
        ('BUY','BUY'),
        ('RENT','RENT')
    )

    title = models.CharField(max_length=255)

    description = models.TextField()

    price = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    property_type = models.CharField(
        max_length=20,
        choices=PROPERTY_TYPES
    )

    listing_type = models.CharField(
        max_length=10,
        choices=LISTING_TYPES
    )

    bedrooms = models.IntegerField()

    bathrooms = models.IntegerField()

    area_sqft = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    address = models.TextField()

    city = models.CharField(max_length=100)

    state = models.CharField(max_length=100)

    pincode = models.CharField(max_length=10)

    agent = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="properties"
    )

    created_at = models.DateTimeField(auto_now_add=True)

class PropertyImage(models.Model):

    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name='images'
    )

    image = models.ImageField(
        upload_to='properties/'
    )