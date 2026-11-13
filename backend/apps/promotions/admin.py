from django.contrib import admin
from .models import Coupon, SampleCampaignConfig, SampleRequest


@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ('code', 'discount_type', 'discount_value', 'min_purchase_amount', 'times_used', 'usage_limit', 'is_active', 'valid_to')
    list_filter = ('discount_type', 'is_active')
    search_fields = ('code',)


@admin.register(SampleCampaignConfig)
class SampleCampaignConfigAdmin(admin.ModelAdmin):
    list_display = ('heading', 'is_active', 'max_total_samples', 'daily_limit', 'bounce_back_coupon_code', 'start_date', 'end_date')


@admin.register(SampleRequest)
class SampleRequestAdmin(admin.ModelAdmin):
    list_display = ('request_id', 'full_name', 'phone', 'city', 'preferred_product_name', 'status', 'created_at', 'tracking_number')
    list_filter = ('status', 'created_at')
    search_fields = ('request_id', 'full_name', 'phone', 'email', 'preferred_product_name', 'city')

