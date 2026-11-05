from decimal import Decimal
from django.db import transaction
from django.db.models import Q
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Order, OrderItem
from .serializers import (
    OrderSerializer,
    CheckoutInputSerializer,
    OrderStatusUpdateSerializer,
)
from cart.views import get_or_create_cart
from catalog.models import ProductVariant
from inventory.models import StockMovement
from promotions.models import Coupon
from accounts.permissions import IsOrderFulfilment, IsStoreManager
from .services import send_order_notifications, generate_whatsapp_order_link
from .shiprocket import ShiprocketLogisticsService


class CheckoutView(APIView):
    permission_classes = [permissions.AllowAny]

    @transaction.atomic
    def post(self, request):
        serializer = CheckoutInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        cart = get_or_create_cart(request)
        cart_items = list(cart.items.select_related('variant__product').all())

        if not cart_items:
            return Response({"error": "Your cart is empty."}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Lock and validate inventory
        subtotal = Decimal('0.00')
        locked_variants = {}

        for item in cart_items:
            # select_for_update prevents concurrent overselling race conditions
            variant = ProductVariant.objects.select_for_update().get(id=item.variant.id)
            if not variant.is_active or not variant.product.is_active:
                return Response(
                    {"error": f"Product '{variant.product.name} ({variant.volume_size})' is currently unavailable."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            if variant.stock_quantity < item.quantity:
                return Response(
                    {"error": f"Insufficient stock for '{variant.product.name} ({variant.volume_size})'. Available: {variant.stock_quantity}."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            locked_variants[item.id] = variant
            subtotal += variant.price * item.quantity

        # 2. Coupon validation & discount calculation
        discount_amount = Decimal('0.00')
        coupon = None
        coupon_code = data.get('coupon_code', '').strip().upper()
        if coupon_code:
            try:
                coupon = Coupon.objects.select_for_update().get(code__iexact=coupon_code)
                is_valid, msg = coupon.is_valid_for_cart(subtotal)
                if is_valid:
                    discount_amount = Decimal(str(coupon.calculate_discount(subtotal)))
                    coupon.times_used += 1
                    coupon.save(update_fields=['times_used'])
                else:
                    return Response({"error": f"Coupon error: {msg}"}, status=status.HTTP_400_BAD_REQUEST)
            except Coupon.DoesNotExist:
                return Response({"error": "Invalid coupon code."}, status=status.HTTP_400_BAD_REQUEST)

        # 3. Shipping & Tax calculation
        # Free shipping on orders >= ₹1999, else ₹150 luxury courier
        if (subtotal - discount_amount) >= Decimal('1999.00'):
            shipping_amount = Decimal('0.00')
        else:
            shipping_amount = Decimal('150.00')

        tax_amount = Decimal('0.00')  # Included in luxury pricing display
        total_amount = max(Decimal('0.00'), subtotal - discount_amount + tax_amount + shipping_amount)

        # 4. Create Order
        user = request.user if request.user.is_authenticated else None
        order_status = Order.Status.PAID if data['payment_method'] == Order.PaymentMethod.COD else Order.Status.PENDING_PAYMENT

        order = Order.objects.create(
            user=user,
            recipient_name=data['recipient_name'],
            phone=data['phone'],
            email=data['email'],
            address_line1=data['address_line1'],
            address_line2=data.get('address_line2', ''),
            landmark=data.get('landmark', ''),
            city=data['city'],
            state=data['state'],
            postal_code=data['postal_code'],
            country=data.get('country', 'India'),
            status=order_status,
            payment_method=data['payment_method'],
            subtotal=subtotal,
            discount_amount=discount_amount,
            tax_amount=tax_amount,
            shipping_amount=shipping_amount,
            total_amount=total_amount,
            coupon_code=coupon_code,
            customer_notes=data.get('customer_notes', '')
        )

        # 5. Create OrderItems, deduct stock & record StockMovements
        for item in cart_items:
            variant = locked_variants[item.id]
            line_total = variant.price * item.quantity

            OrderItem.objects.create(
                order=order,
                variant=variant,
                product_name_snapshot=variant.product.name,
                variant_size_snapshot=variant.volume_size,
                sku_snapshot=variant.sku,
                unit_price=variant.price,
                quantity=item.quantity,
                line_total=line_total,
            )

            # Deduct inventory
            new_stock = variant.stock_quantity - item.quantity
            variant.stock_quantity = new_stock
            variant.save(update_fields=['stock_quantity'])

            # Log audit movement
            StockMovement.objects.create(
                variant=variant,
                quantity_change=-item.quantity,
                balance_after=new_stock,
                reason=StockMovement.Reason.ORDER_SALE,
                notes=f"Order {order.order_number}",
                reference_type='ORDER',
                reference_id=order.order_number,
                actor=user,
            )

        # 6. Clear cart
        cart.items.all().delete()

        # 7. Automated Email Invoice & WhatsApp link
        send_order_notifications(order)
        response_data = OrderSerializer(order).data
        response_data['whatsapp_confirmation_url'] = generate_whatsapp_order_link(order)

        return Response(response_data, status=status.HTTP_201_CREATED)


class CustomerOrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')


class CustomerOrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'order_number'

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


class OrderTrackView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        order_number = request.data.get('order_number', '').strip().upper()
        verification = request.data.get('verification', '').strip().lower()

        if not order_number or not verification:
            return Response(
                {"error": "Order number and verification contact (phone or email) are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        order = Order.objects.filter(order_number=order_number).first()
        if not order:
            return Response({"error": "Order not found with provided reference."}, status=status.HTTP_404_NOT_FOUND)

        # Verify email or phone matches order
        if order.email.lower() != verification and order.phone.strip() != verification:
            return Response(
                {"error": "Verification details do not match the records for this order."},
                status=status.HTTP_403_FORBIDDEN
            )

        return Response(OrderSerializer(order).data)


# Admin Order Views
class AdminOrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsOrderFulfilment]

    def get_queryset(self):
        queryset = Order.objects.all().order_by('-created_at')
        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(order_number__icontains=search) |
                Q(recipient_name__icontains=search) |
                Q(phone__icontains=search)
            )
        return queryset


class AdminOrderDetailView(generics.RetrieveAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsOrderFulfilment]
    lookup_field = 'order_number'


class AdminOrderStatusUpdateView(APIView):
    permission_classes = [IsOrderFulfilment]

    @transaction.atomic
    def patch(self, request, order_number):
        try:
            order = Order.objects.select_for_update().get(order_number=order_number)
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = OrderStatusUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        new_status = serializer.validated_data['status']

        old_status = order.status
        order.status = new_status

        if 'carrier_name' in serializer.validated_data:
            order.carrier_name = serializer.validated_data['carrier_name']
        if 'tracking_number' in serializer.validated_data:
            order.tracking_number = serializer.validated_data['tracking_number']
        if 'cancelled_reason' in serializer.validated_data:
            order.cancelled_reason = serializer.validated_data['cancelled_reason']

        if new_status == Order.Status.SHIPPED and not order.shipped_at:
            order.shipped_at = timezone.now()
        elif new_status == Order.Status.DELIVERED and not order.delivered_at:
            order.delivered_at = timezone.now()

        # If order cancelled, return inventory back to stock and create auditable StockMovement
        if new_status == Order.Status.CANCELLED and old_status != Order.Status.CANCELLED:
            for item in order.items.all():
                if item.variant:
                    variant = ProductVariant.objects.select_for_update().get(id=item.variant.id)
                    variant.stock_quantity += item.quantity
                    variant.save(update_fields=['stock_quantity'])
                    StockMovement.objects.create(
                        variant=variant,
                        quantity_change=item.quantity,
                        balance_after=variant.stock_quantity,
                        reason=StockMovement.Reason.ORDER_CANCEL,
                        notes=f"Order {order.order_number} cancelled: {order.cancelled_reason}",
                        reference_type='ORDER',
                        reference_id=order.order_number,
                        actor=request.user,
                    )

        order.save()
        return Response(OrderSerializer(order).data)


class AdminShiprocketDispatchView(APIView):
    permission_classes = [IsOrderFulfilment]

    def post(self, request, pk):
        try:
            order = Order.objects.get(pk=pk)
        except Order.DoesNotExist:
            return Response({"error": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

        logistics = ShiprocketLogisticsService()
        result = logistics.generate_shipment(order)

        order.carrier_name = result['carrier_name']
        order.tracking_number = result['tracking_number']
        order.status = Order.Status.SHIPPED
        order.shipped_at = timezone.now()
        order.save()

        # Update customer with notification
        send_order_notifications(order)

        return Response({
            "message": "Shipment generated successfully via Shiprocket.",
            "carrier_name": order.carrier_name,
            "tracking_number": order.tracking_number,
            "order": OrderSerializer(order).data
        })
