"""DRF serializers for API models."""

from rest_framework import serializers

from .models import Conversation, Project, UserProfile


class ProjectSerializer(serializers.ModelSerializer):
    """Serializer for Project model."""

    class Meta:
        model = Project
        fields = "__all__"


class ConversationSerializer(serializers.ModelSerializer):
    """Serializer for Conversation model."""

    class Meta:
        model = Conversation
        fields = "__all__"


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for UserProfile model."""

    class Meta:
        model = UserProfile
        fields = "__all__"
