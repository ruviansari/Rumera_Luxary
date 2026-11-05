from django.contrib import admin
from .models import PaymentTransaction


@admin.register(PaymentTransaction)
class PaymentTransactionAdmin(admin.ModelAdmin):
    list_display = ('transaction_id', 'order', 'provider', 'amount', 'status', 'created_at', 'verified_at')
    list_filter = ('provider', 'status', 'created_at')
    search_fields = ('transaction_id', 'order__order_number', 'gateway_order_id')
    readonly_fields = ('created_at',)
