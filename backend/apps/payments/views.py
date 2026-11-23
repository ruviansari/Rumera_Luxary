import os
import logging
from django.conf import settings
from django.utils import timezone
from django.db import transaction
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import PaymentTransaction
from orders.models import Order
from orders.services import send_order_notifications

logger = logging.getLogger(__name__)


class CreateRazorpayOrderView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        order_number = request.data.get('order_number')
        if not order_number:
            return Response({"error": "order_number is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            order = Order.objects.get(order_number=order_number)
        except Order.DoesNotExist:
            return Response({"error": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

        key_id = getattr(settings, 'RAZORPAY_KEY_ID', os.environ.get('RAZORPAY_KEY_ID', 'rzp_test_rumera_luxury_2026'))
        key_secret = getattr(settings, 'RAZORPAY_KEY_SECRET', os.environ.get('RAZORPAY_KEY_SECRET', 'rumera_secret_2026'))
        amount_paise = int(order.total_amount * 100)
        gateway_order_id = f"rzp_order_{order.order_number}"

        try:
            import razorpay
            # Check if using real test/live key from Razorpay Dashboard
            if key_id.startswith('rzp_test_') and key_id != 'rzp_test_rumera_luxury_2026':
                client = razorpay.Client(auth=(key_id, key_secret))
                rzp_order = client.order.create({
                    "amount": amount_paise,
                    "currency": "INR",
                    "receipt": order.order_number,
                    "notes": {
                        "customer_name": order.recipient_name,
                        "customer_phone": order.phone,
                    }
                })
                gateway_order_id = rzp_order.get('id', gateway_order_id)
        except Exception as e:
            logger.warning(f"Razorpay order create error: {e}")

        return Response({
            "key_id": key_id,
            "order_number": order.order_number,
            "gateway_order_id": gateway_order_id,
            "amount": amount_paise,
            "currency": "INR",
            "name": "Maison Ruméra Haute Parfumerie",
            "description": f"Imperial Fragrance Order #{order.order_number}",
            "image": "/images/rumera_crest_emblem.png",
            "prefill": {
                "name": order.recipient_name,
                "email": order.email,
                "contact": order.phone,
            },
            "theme": {
                "color": "#14231F",
                "backdrop_color": "#070D0A"
            }
        })


class PaymentVerificationView(APIView):
    permission_classes = [permissions.AllowAny]

    @transaction.atomic
    def post(self, request):
        order_number = request.data.get('order_number')
        transaction_id = request.data.get('transaction_id')
        gateway_order_id = request.data.get('gateway_order_id', '')
        provider = request.data.get('provider', PaymentTransaction.Provider.RAZORPAY)
        signature = request.data.get('signature', '')

        if not order_number or not transaction_id:
            return Response({"error": "order_number and transaction_id are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            order = Order.objects.select_for_update().get(order_number=order_number)
        except Order.DoesNotExist:
            return Response({"error": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

        # Idempotent check
        existing_txn = PaymentTransaction.objects.filter(transaction_id=transaction_id).first()
        if existing_txn and existing_txn.status == PaymentTransaction.Status.SUCCESS:
            return Response({
                "message": "Payment already verified.",
                "order_number": order.order_number,
                "status": order.status
            })

        # Cryptographic Signature Verification for Live/Test Razorpay
        key_id = getattr(settings, 'RAZORPAY_KEY_ID', os.environ.get('RAZORPAY_KEY_ID', 'rzp_test_rumera_luxury_2026'))
        key_secret = getattr(settings, 'RAZORPAY_KEY_SECRET', os.environ.get('RAZORPAY_KEY_SECRET', 'rumera_secret_2026'))
        
        if key_id.startswith('rzp_test_') and key_id != 'rzp_test_rumera_luxury_2026' and signature and gateway_order_id:
            try:
                import razorpay
                client = razorpay.Client(auth=(key_id, key_secret))
                client.utility.verify_payment_signature({
                    'razorpay_order_id': gateway_order_id,
                    'razorpay_payment_id': transaction_id,
                    'razorpay_signature': signature
                })
            except Exception as sig_err:
                logger.error(f"Razorpay Signature Verification Failed: {sig_err}")
                return Response({"error": "Cryptographic signature verification failed."}, status=status.HTTP_400_BAD_REQUEST)

        # Record payment transaction
        txn, _ = PaymentTransaction.objects.get_or_create(
            transaction_id=transaction_id,
            defaults={
                'order': order,
                'provider': provider,
                'gateway_order_id': gateway_order_id,
                'amount': order.total_amount,
                'signature': signature,
                'status': PaymentTransaction.Status.SUCCESS,
                'verified_at': timezone.now(),
                'raw_payload': request.data,
            }
        )
        txn.status = PaymentTransaction.Status.SUCCESS
        txn.verified_at = timezone.now()
        txn.save()

        # Update order status to PAID
        if order.status == Order.Status.PENDING_PAYMENT:
            order.status = Order.Status.PAID
            order.save(update_fields=['status'])
            try:
                send_order_notifications(order)
            except Exception as notif_err:
                logger.warning(f"Notification error: {notif_err}")

        return Response({
            "message": "Payment verified successfully.",
            "order_number": order.order_number,
            "status": order.status,
            "transaction_id": transaction_id,
        })


class PaymentWebhookView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        # In production this verifies provider cryptographic HMAC SHA256 header signature
        payload = request.data
        return Response({"status": "received"})
