
from rest_framework import serializers

from .models import Task
from categories.models import Category


class TaskSerializer(serializers.ModelSerializer):

    category_name = serializers.CharField(
        source="category.name",
        read_only=True,
        allow_null=True
    )

    class Meta:
        model = Task

        fields = [
            "id",
            "title",
            "description",
            "category",
            "category_name",
            "priority",
            "due_date",
            "status",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "category_name",
            "created_at",
            "updated_at",
        ]

    def validate_title(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Task title cannot be empty."
            )

        return value

    def validate_category(self, value):
        if value is None:
            return value

        request = self.context.get("request")

        if request and value.user_id != request.user.id:
            raise serializers.ValidationError(
                "You cannot assign another user's category."
            )

        return value
