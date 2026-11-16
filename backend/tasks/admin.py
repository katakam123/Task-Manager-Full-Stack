
from django.contrib import admin

from .models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):

    list_display = [
        "id",
        "title",
        "user",
        "category",
        "priority",
        "status",
        "due_date",
        "created_at",
    ]

    list_filter = [
        "status",
        "priority",
        "category",
        "created_at",
    ]

    search_fields = [
        "title",
        "description",
        "user__username",
    ]

    readonly_fields = [
        "created_at",
        "updated_at",
    ]
