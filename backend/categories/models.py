
from django.conf import settings
from django.db import models
from django.db.models.functions import Lower


class Category(models.Model):

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="categories"
    )

    name = models.CharField(
        max_length=100
    )

    color = models.CharField(
        max_length=7,
        default="#4F46E5"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ["name"]

        constraints = [
            models.UniqueConstraint(
                Lower("name"),
                "user",
                name="unique_category_name_per_user"
            )
        ]

    def __str__(self):
        return f"{self.name} - {self.user.username}"
