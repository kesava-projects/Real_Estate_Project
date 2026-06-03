from django.db import models
from accounts.models import User
from properties.models import Property

# Create your models here.
class ContactRequest(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE
    )

    message = models.TextField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )


class ContactReply(models.Model):
    contact = models.ForeignKey(
        ContactRequest,
        on_delete=models.CASCADE,
        related_name='replies',
    )
    sender = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']