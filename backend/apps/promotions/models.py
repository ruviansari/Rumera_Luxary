from django.db import models
from django.utils import timezone
from django.utils.crypto import get_random_string


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


class SampleCampaignConfig(models.Model):
    is_active = models.BooleanField(default=True, help_text="Toggle campaign on or off")
    title = models.CharField(max_length=200, default="RUMÉRA Imperial Free Flacon Sampling Campaign")
    heading = models.CharField(max_length=255, default="YOUR FIRST FRAGRANCE IS ON US!")
    subheading = models.TextField(default="Discover the luxury of RUMÉRA. Experience your favourite fragrance before you buy.")
    offer_badge = models.CharField(max_length=100, default="GET YOUR FREE PERFUME SAMPLE")
    cta_text = models.CharField(max_length=100, default="CLAIM YOUR FREE SAMPLE")
    start_date = models.DateTimeField(default=timezone.now)
    end_date = models.DateTimeField(null=True, blank=True, help_text="Leave blank for ongoing campaign")
    max_total_samples = models.PositiveIntegerField(default=150, help_text="Total allocation of free samples")
    max_samples_per_customer = models.PositiveIntegerField(default=1)
    daily_limit = models.PositiveIntegerField(default=25)
    bounce_back_coupon_code = models.CharField(max_length=50, default="SAMPLEVIP15")
    bounce_back_discount_percent = models.PositiveIntegerField(default=15)
    terms_text = models.TextField(
        blank=True,
        default="1 complimentary 2.5ml discovery flacon per patron and shipping address. Pan-India complimentary shipping. Strictly for authentic fragrance connoisseurs."
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Sample Campaign Configuration"
        verbose_name_plural = "Sample Campaign Configuration"

    @classmethod
    def get_config(cls):
        config, created = cls.objects.get_or_create(id=1)
        return config

    def get_claimed_count(self):
        return self.sample_requests.exclude(status='REJECTED').count()

    def get_remaining_count(self):
        claimed = self.get_claimed_count()
        return max(0, self.max_total_samples - claimed)

    def is_running(self):
        if not self.is_active:
            return False
        now = timezone.now()
        if self.start_date and now < self.start_date:
            return False
        if self.end_date and now > self.end_date:
            return False
        if self.get_remaining_count() <= 0:
            return False
        return True

    def __str__(self):
        return f"Sample Campaign: {self.heading} ({'ACTIVE' if self.is_active else 'PAUSED'})"


class SampleRequest(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending Review'
        APPROVED = 'APPROVED', 'Approved & Queued'
        DISPATCHED = 'DISPATCHED', 'Dispatched'
        DELIVERED = 'DELIVERED', 'Delivered'
        REJECTED = 'REJECTED', 'Rejected'

    campaign = models.ForeignKey(
        SampleCampaignConfig,
        related_name='sample_requests',
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    request_id = models.CharField(max_length=60, unique=True, db_index=True)
    full_name = models.CharField(max_length=150)
    email = models.EmailField(db_index=True)
    phone = models.CharField(max_length=20, db_index=True)
    address_line1 = models.TextField(verbose_name="Delivery Address")
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)
    preferred_product = models.ForeignKey(
        'catalog.Product',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='sample_requests'
    )
    preferred_product_name = models.CharField(max_length=255, blank=True)
    sample_quantity = models.PositiveIntegerField(default=1)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
        db_index=True
    )
    courier_partner = models.CharField(max_length=100, blank=True)
    tracking_number = models.CharField(max_length=120, blank=True)
    admin_notes = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    dispatched_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['email', 'phone']),
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
        ]

    @classmethod
    def generate_unique_request_id(cls):
        date_str = timezone.now().strftime('%y%m')
        for _ in range(10):
            rand = get_random_string(5, allowed_chars='23456789ABCDEFGHJKLMNPQRSTUVWXYZ')
            req_id = f"RMR-SMP-{date_str}-{rand}"
            if not cls.objects.filter(request_id=req_id).exists():
                return req_id
        return f"RMR-SMP-{date_str}-{int(timezone.now().timestamp())}"

    def __str__(self):
        return f"[{self.request_id}] {self.full_name} ({self.preferred_product_name or 'Sample'}) - {self.status}"

