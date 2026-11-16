
from django.contrib import admin

from .models import Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):

    list_display = [
        "id",
        "name",
        "user",
        "color",
        "created_at",
    ]

    list_filter = [
        "created_at",
    ]

    search_fields = [
        "name",
        "user__username",
        "user__email",
    ]
