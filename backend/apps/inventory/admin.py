from django.contrib import admin
from .models import StockMovement


@admin.register(StockMovement)
class StockMovementAdmin(admin.ModelAdmin):
    list_display = ('variant', 'quantity_change', 'balance_after', 'reason', 'actor', 'reference_type', 'reference_id', 'created_at')
    list_filter = ('reason', 'reference_type', 'created_at')
    search_fields = ('variant__sku', 'variant__product__name', 'notes', 'reference_id')
    readonly_fields = ('created_at',)
