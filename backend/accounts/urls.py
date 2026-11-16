
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import RegisterView, ProfileView, LogoutView


urlpatterns = [
    # User registration
    path("register/", RegisterView.as_view(), name="register"),

    # JWT login
    path("login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),

    # Refresh JWT access token
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # User profile
    path("profile/", ProfileView.as_view(), name="profile"),

    # Logout
    path("logout/", LogoutView.as_view(), name="logout"),
]
