from rest_framework import serializers
from .models import AuditEvent


class AuditEventSerializer(serializers.ModelSerializer):
    actor_email = serializers.ReadOnlyField(source='actor.email')

    class Meta:
        model = AuditEvent
        fields = ['id', 'actor_email', 'action', 'entity_name', 'entity_id', 'reason', 'metadata', 'ip_address', 'created_at']
