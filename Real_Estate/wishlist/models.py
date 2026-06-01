from django.db import models
from accounts.models import User
from properties.models import Property

# Create your models here.
class Wishlist(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE
    )

    added_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        unique_together = ['user','property']