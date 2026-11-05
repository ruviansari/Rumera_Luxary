from django.db import models
from django.conf import settings
from catalog.models import ProductVariant


class StockMovement(models.Model):
    class Reason(models.TextChoices):
        INITIAL = 'INITIAL', 'Initial stock'
        RESTOCK = 'RESTOCK', 'Restock / Purchase batch'
        ORDER_SALE = 'ORDER_SALE', 'Customer Order reservation'
        ORDER_CANCEL = 'ORDER_CANCEL', 'Order cancellation restock'
        RETURN_RESTOCK = 'RETURN_RESTOCK', 'Customer return restock'
        DAMAGE = 'DAMAGE', 'Damaged / Spillage write-off'
        AUDIT_ADJUSTMENT = 'AUDIT_ADJUSTMENT', 'Physical audit adjustment'
        MANUAL = 'MANUAL', 'Manual manager adjustment'

    variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE, related_name='stock_movements')
    quantity_change = models.IntegerField(help_text="Signed integer: positive for addition, negative for deduction")
    balance_after = models.PositiveIntegerField(help_text="Stock quantity after this movement")
    reason = models.CharField(max_length=50, choices=Reason.choices, default=Reason.MANUAL)
    notes = models.TextField(blank=True, help_text="Mandatory or descriptive explanation")
    reference_type = models.CharField(max_length=50, blank=True, help_text="e.g. ORDER, PO, AUDIT")
    reference_id = models.CharField(max_length=100, blank=True)
    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='stock_adjustments'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        sign = "+" if self.quantity_change > 0 else ""
        return f"{self.variant.product.name} ({self.variant.volume_size}): {sign}{self.quantity_change} ({self.get_reason_display()})"
