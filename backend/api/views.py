"""REST API views."""

from rest_framework import viewsets

from .models import Conversation, Project, UserProfile
from .serializers import ConversationSerializer, ProjectSerializer, UserProfileSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    """CRUD operations for projects."""

    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


class ConversationViewSet(viewsets.ModelViewSet):
    """CRUD operations for conversations."""

    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer


class UserProfileViewSet(viewsets.ModelViewSet):
    """CRUD operations for user profiles."""

    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
