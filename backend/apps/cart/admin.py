from django.contrib import admin
from .models import Cart, CartItem


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'session_key', 'total_items', 'subtotal', 'created_at', 'updated_at')
    search_fields = ('user__email', 'session_key')
    readonly_fields = ('created_at', 'updated_at')
    inlines = [CartItemInline]
