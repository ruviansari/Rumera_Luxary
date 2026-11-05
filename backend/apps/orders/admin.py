from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product_name_snapshot', 'variant_size_snapshot', 'sku_snapshot', 'unit_price', 'quantity', 'line_total')


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'recipient_name', 'phone', 'city', 'status', 'payment_method', 'total_amount', 'created_at')
    list_filter = ('status', 'payment_method', 'created_at')
    search_fields = ('order_number', 'recipient_name', 'phone', 'email', 'tracking_number')
    readonly_fields = ('order_number', 'created_at', 'updated_at')
    inlines = [OrderItemInline]


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'product_name_snapshot', 'variant_size_snapshot', 'quantity', 'unit_price', 'line_total')
    search_fields = ('order__order_number', 'product_name_snapshot', 'sku_snapshot')
