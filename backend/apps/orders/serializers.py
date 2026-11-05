from rest_framework import serializers
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = [
            'id', 'variant', 'product_name_snapshot', 'variant_size_snapshot',
            'sku_snapshot', 'unit_price', 'quantity', 'line_total'
        ]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    status_display = serializers.ReadOnlyField(source='get_status_display')
    payment_method_display = serializers.ReadOnlyField(source='get_payment_method_display')

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'status', 'status_display', 'recipient_name',
            'phone', 'email', 'address_line1', 'address_line2', 'landmark',
            'city', 'state', 'postal_code', 'country', 'payment_method',
            'payment_method_display', 'subtotal', 'discount_amount',
            'tax_amount', 'shipping_amount', 'total_amount', 'coupon_code',
            'customer_notes', 'carrier_name', 'tracking_number', 'shipped_at',
            'delivered_at', 'cancelled_reason', 'items', 'created_at'
        ]
        read_only_fields = [
            'id', 'order_number', 'status', 'subtotal', 'discount_amount',
            'tax_amount', 'shipping_amount', 'total_amount', 'carrier_name',
            'tracking_number', 'shipped_at', 'delivered_at', 'created_at'
        ]


class CheckoutInputSerializer(serializers.Serializer):
    recipient_name = serializers.CharField(max_length=255)
    phone = serializers.CharField(max_length=20)
    email = serializers.EmailField()
    address_line1 = serializers.CharField(max_length=255)
    address_line2 = serializers.CharField(max_length=255, required=False, allow_blank=True)
    landmark = serializers.CharField(max_length=255, required=False, allow_blank=True)
    city = serializers.CharField(max_length=100)
    state = serializers.CharField(max_length=100)
    postal_code = serializers.CharField(max_length=20)
    country = serializers.CharField(max_length=100, default='India')
    payment_method = serializers.ChoiceField(choices=Order.PaymentMethod.choices)
    coupon_code = serializers.CharField(required=False, allow_blank=True)
    customer_notes = serializers.CharField(required=False, allow_blank=True)


class OrderStatusUpdateSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Order.Status.choices)
    carrier_name = serializers.CharField(required=False, allow_blank=True)
    tracking_number = serializers.CharField(required=False, allow_blank=True)
    cancelled_reason = serializers.CharField(required=False, allow_blank=True)
