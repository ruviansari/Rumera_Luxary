from django.db import models
from django.utils import timezone


class Coupon(models.Model):
    class DiscountType(models.TextChoices):
        PERCENTAGE = 'PERCENTAGE', 'Percentage Discount'
        FIXED = 'FIXED', 'Fixed Amount (INR)'

    code = models.CharField(max_length=50, unique=True)
    discount_type = models.CharField(max_length=20, choices=DiscountType.choices, default=DiscountType.PERCENTAGE)
    discount_value = models.DecimalField(max_digits=10, decimal_places=2, help_text="e.g. 15 for 15% or 200 for ₹200 off")
    min_purchase_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    max_discount_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    valid_from = models.DateTimeField(default=timezone.now)
    valid_to = models.DateTimeField()
    usage_limit = models.PositiveIntegerField(default=100)
    times_used = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_valid_for_cart(self, cart_subtotal):
        now = timezone.now()
        if not self.is_active:
            return False, "This coupon is inactive."
        if now < self.valid_from or now > self.valid_to:
            return False, "This coupon has expired or is not yet active."
        if self.times_used >= self.usage_limit:
            return False, "This coupon usage limit has been reached."
        if cart_subtotal < self.min_purchase_amount:
            return False, f"Minimum purchase amount of ₹{self.min_purchase_amount} required."
        return True, "Coupon is valid."

    def calculate_discount(self, cart_subtotal):
        if self.discount_type == self.DiscountType.PERCENTAGE:
            discount = (cart_subtotal * self.discount_value) / 100
            if self.max_discount_amount and discount > self.max_discount_amount:
                discount = self.max_discount_amount
            return min(discount, cart_subtotal)
        else:
            return min(self.discount_value, cart_subtotal)

    def __str__(self):
        return f"{self.code} ({self.discount_value} {self.get_discount_type_display()})"
