
from rest_framework import viewsets, permissions

from .models import Category
from .serializers import CategorySerializer


class CategoryViewSet(viewsets.ModelViewSet):

    serializer_class = CategorySerializer

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self):
        # Users can access only their own categories.
        return Category.objects.filter(
            user=self.request.user
        )

    def perform_create(self, serializer):
        # Automatically assign the logged-in user.
        serializer.save(
            user=self.request.user
        )
