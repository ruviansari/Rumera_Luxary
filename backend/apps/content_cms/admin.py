from django.contrib import admin
from .models import OwnerProfile, ContentPage


@admin.register(OwnerProfile)
class OwnerProfileAdmin(admin.ModelAdmin):
    list_display = ('display_name', 'title', 'is_published', 'updated_at')


@admin.register(ContentPage)
class ContentPageAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'is_published', 'updated_at')
    prepopulated_fields = {'slug': ('title',)}
