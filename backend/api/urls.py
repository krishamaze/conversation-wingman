"""API routing configuration."""

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import ConversationViewSet, ProjectViewSet, UserProfileViewSet

router = DefaultRouter()
router.register(r"projects", ProjectViewSet, basename="project")
router.register(r"conversations", ConversationViewSet, basename="conversation")
router.register(r"profiles", UserProfileViewSet, basename="profile")

urlpatterns = router.urls
