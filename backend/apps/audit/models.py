from django.db import models
from django.conf import settings


class AuditEvent(models.Model):
    class Action(models.TextChoices):
        CREATE = 'CREATE', 'Create'
        UPDATE = 'UPDATE', 'Update'
        DELETE = 'DELETE', 'Delete'
        STOCK_ADJUST = 'STOCK_ADJUST', 'Stock Adjustment'
        STATUS_TRANSITION = 'STATUS_TRANSITION', 'Status Transition'
        PRICE_OVERRIDE = 'PRICE_OVERRIDE', 'Price Override'
        REFUND = 'REFUND', 'Refund Triggered'
        PUBLISH = 'PUBLISH', 'Publish Content'

    actor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=50, choices=Action.choices)
    entity_name = models.CharField(max_length=100)
    entity_id = models.CharField(max_length=100)
    reason = models.CharField(max_length=255, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        actor_email = self.actor.email if self.actor else "System"
        return f"[{self.created_at.strftime('%Y-%m-%d %H:%M')}] {actor_email} -> {self.action} on {self.entity_name} ({self.entity_id})"
