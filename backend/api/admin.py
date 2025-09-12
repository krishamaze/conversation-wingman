"""Admin site registrations."""

from django.contrib import admin

from .models import Conversation, Project, UserProfile


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("name", "owner")


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ("project", "created_at")


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user",)
