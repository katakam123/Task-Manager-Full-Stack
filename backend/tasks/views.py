
from rest_framework import viewsets, permissions
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

from .models import Task
from .serializers import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):

    serializer_class = TaskSerializer

    permission_classes = [
        permissions.IsAuthenticated
    ]

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    # Available filters
    filterset_fields = [
        "status",
        "priority",
        "category",
    ]

    # Search fields
    search_fields = [
        "title",
        "description",
    ]

    # Ordering fields
    ordering_fields = [
        "created_at",
        "updated_at",
        "due_date",
        "priority",
        "title",
    ]

    ordering = ["-created_at"]

    def get_queryset(self):
        # Users can only access their own tasks.
        return Task.objects.filter(
            user=self.request.user
        ).select_related("category")

    def perform_create(self, serializer):
        # Automatically assign the logged-in user.
        serializer.save(
            user=self.request.user
        )
