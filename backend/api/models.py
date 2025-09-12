"""Database models for conversation storage."""

from django.db import models
from django.contrib.auth.models import User
from pgvector.django import VectorField


class Project(models.Model):
    """User project grouping conversations."""

    name = models.CharField(max_length=255)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="projects")

    def __str__(self) -> str:  # pragma: no cover - simple representation
        return self.name


class Conversation(models.Model):
    """Stores a single conversation entry."""

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="conversations")
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    embedding = VectorField(dimensions=1536, null=True, blank=True)

    def __str__(self) -> str:  # pragma: no cover
        return self.content[:50]


class UserProfile(models.Model):
    """Extended profile for application-specific settings."""

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    preferences = models.JSONField(blank=True, null=True)

    def __str__(self) -> str:  # pragma: no cover
        return f"Profile for {self.user.username}"
