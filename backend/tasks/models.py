
from django.conf import settings
from django.db import models


class Task(models.Model):

    class Priority(models.TextChoices):
        LOW = "low", "Low"
        MEDIUM = "medium", "Medium"
        HIGH = "high", "High"

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        IN_PROGRESS = "in_progress", "In Progress"
        COMPLETED = "completed", "Completed"

    # Task owner
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="tasks"
    )

    # Basic task information
    title = models.CharField(
        max_length=255
    )

    description = models.TextField(
        blank=True,
        default=""
    )

    # Optional category
    category = models.ForeignKey(
        "categories.Category",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="tasks"
    )

    # Task priority
    priority = models.CharField(
        max_length=10,
        choices=Priority.choices,
        default=Priority.MEDIUM
    )

    # Task deadline
    due_date = models.DateTimeField(
        null=True,
        blank=True
    )

    # Task status
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )

    # Timestamps
    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ["-created_at"]

        indexes = [
            models.Index(
                fields=["user", "status"],
                name="task_user_status_idx"
            ),
            models.Index(
                fields=["user", "priority"],
                name="task_user_priority_idx"
            ),
            models.Index(
                fields=["user", "due_date"],
                name="task_user_due_date_idx"
            ),
        ]

    def __str__(self):
        return self.title
