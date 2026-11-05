from django.contrib import admin
from .models import AuditEvent


@admin.register(AuditEvent)
class AuditEventAdmin(admin.ModelAdmin):
    list_display = ('created_at', 'actor', 'action', 'entity_name', 'entity_id', 'reason', 'ip_address')
    list_filter = ('action', 'entity_name', 'created_at')
    search_fields = ('actor__email', 'entity_id', 'reason')
    readonly_fields = ('created_at',)
