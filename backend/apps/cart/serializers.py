from rest_framework import serializers
from .models import Cart, CartItem
from catalog.serializers import ProductVariantSerializer, ProductListSerializer


class CartItemSerializer(serializers.ModelSerializer):
    variant = ProductVariantSerializer(read_only=True)
    product_name = serializers.ReadOnlyField(source='variant.product.name')
    product_slug = serializers.ReadOnlyField(source='variant.product.slug')
    product_image = serializers.ReadOnlyField(source='variant.product.primary_image')
    line_total = serializers.ReadOnlyField()

    class Meta:
        model = CartItem
        fields = [
            'id', 'variant', 'quantity', 'product_name', 'product_slug',
            'product_image', 'line_total'
        ]


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    subtotal = serializers.ReadOnlyField()
    total_items = serializers.ReadOnlyField()

    class Meta:
        model = Cart
        fields = ['id', 'session_key', 'items', 'subtotal', 'total_items', 'updated_at']
