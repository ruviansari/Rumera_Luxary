from django.db import models
from orders.models import Order


class PaymentTransaction(models.Model):
    class Provider(models.TextChoices):
        RAZORPAY = 'RAZORPAY', 'Razorpay'
        PAYU = 'PAYU', 'PayU'
        STRIPE = 'STRIPE', 'Stripe'
        COD = 'COD', 'Cash on Delivery'
        MANUAL = 'MANUAL', 'Manual Admin Settlement'

    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending Verification'
        SUCCESS = 'SUCCESS', 'Payment Verified & Captured'
        FAILED = 'FAILED', 'Payment Failed'
        REFUNDED = 'REFUNDED', 'Refunded'

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='payments')
    provider = models.CharField(max_length=50, choices=Provider.choices, default=Provider.RAZORPAY)
    transaction_id = models.CharField(max_length=150, unique=True, db_index=True)
    gateway_order_id = models.CharField(max_length=150, blank=True)
    signature = models.CharField(max_length=255, blank=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=30, choices=Status.choices, default=Status.PENDING)
    raw_payload = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    verified_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.provider} Txn {self.transaction_id} for Order {self.order.order_number}: ₹{self.amount} ({self.status})"
