
from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path("admin/", admin.site.urls),

    # Accounts API
    path(
        "api/accounts/",
        include("accounts.urls")
    ),

    # Categories API
    path(
        "api/categories/",
        include("categories.urls")
    ),

    # Tasks API
    path(
        "api/tasks/",
        include("tasks.urls")
    ),

    # Dashboard API
    path(
        "api/dashboard/",
        include("dashboard.urls")
    ),
]
