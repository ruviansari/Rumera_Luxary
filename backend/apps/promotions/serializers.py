import re
from rest_framework import serializers
from django.db.models import Q
from django.utils import timezone
from .models import Coupon, SampleCampaignConfig, SampleRequest
from catalog.models import Product


class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = '__all__'


class ValidateCouponSerializer(serializers.Serializer):
    code = serializers.CharField(required=True)
    subtotal = serializers.DecimalField(max_digits=12, decimal_places=2, required=True)


class SampleCampaignConfigSerializer(serializers.ModelSerializer):
    claimed_count = serializers.SerializerMethodField()
    remaining_count = serializers.SerializerMethodField()
    is_running = serializers.SerializerMethodField()

    class Meta:
        model = SampleCampaignConfig
        fields = [
            'id', 'is_active', 'title', 'heading', 'subheading',
            'offer_badge', 'cta_text', 'start_date', 'end_date',
            'max_total_samples', 'max_samples_per_customer', 'daily_limit',
            'bounce_back_coupon_code', 'bounce_back_discount_percent',
            'terms_text', 'claimed_count', 'remaining_count', 'is_running'
        ]

    def get_claimed_count(self, obj):
        return obj.get_claimed_count()

    def get_remaining_count(self, obj):
        return obj.get_remaining_count()

    def get_is_running(self, obj):
        return obj.is_running()


class SampleFragranceItemSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    primary_image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'category_name', 'product_type',
            'fragrance_family', 'concentration', 'short_description',
            'primary_image'
        ]

    def get_primary_image(self, obj):
        first_img = obj.images.filter(is_primary=True).first() or obj.images.first()
        if first_img and first_img.image_url:
            return first_img.image_url
        return '/images/rumera_white_oud_hero.jpg'


class SampleRequestPublicCreateSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=150, min_length=2)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=20)
    address_line1 = serializers.CharField(min_length=5)
    city = serializers.CharField(max_length=100, min_length=2)
    state = serializers.CharField(max_length=100, min_length=2)
    pincode = serializers.CharField(max_length=10)
    preferred_product_id = serializers.IntegerField(required=False, allow_null=True)
    sample_quantity = serializers.IntegerField(default=1, min_value=1, max_value=2)
    terms_accepted = serializers.BooleanField(required=True)

    def validate_terms_accepted(self, value):
        if not value:
            raise serializers.ValidationError("You must accept the terms and privacy policy to reserve a free sample.")
        return value

    def validate_phone(self, value):
        # Remove non-digits
        digits = re.sub(r'\D', '', value)
        if digits.startswith('91') and len(digits) == 12:
            digits = digits[2:]
        elif digits.startswith('0') and len(digits) == 11:
            digits = digits[1:]
        
        if len(digits) != 10:
            raise serializers.ValidationError("Please provide a valid 10-digit mobile number.")
        return digits

    def validate_pincode(self, value):
        digits = re.sub(r'\D', '', value)
        if len(digits) != 6:
            raise serializers.ValidationError("Please enter a valid 6-digit Indian PIN code.")
        return digits

    def validate(self, attrs):
        config = SampleCampaignConfig.get_config()
        if not config.is_running():
            raise serializers.ValidationError(
                "The complimentary sampling campaign is currently paused or our daily allocation is full. Please check back soon."
            )

        email = attrs.get('email', '').strip().lower()
        phone = attrs.get('phone', '').strip()

        # Check duplicate
        duplicate = SampleRequest.objects.filter(
            Q(email__iexact=email) | Q(phone=phone)
        ).exclude(status=SampleRequest.Status.REJECTED).first()

        if duplicate:
            raise serializers.ValidationError(
                f"A complimentary flacon sample has already been registered under this contact ({duplicate.request_id}). Each patron is entitled to one discovery allotment."
            )

        # Validate preferred product if provided
        prod_id = attrs.get('preferred_product_id')
        if prod_id:
            try:
                attrs['product_instance'] = Product.objects.get(id=prod_id, status=Product.Status.ACTIVE)
            except Product.DoesNotExist:
                raise serializers.ValidationError("The selected fragrance is currently unavailable for sampling.")
        else:
            attrs['product_instance'] = Product.objects.filter(status=Product.Status.ACTIVE).first()

        attrs['config_instance'] = config
        return attrs

    def create(self, validated_data):
        config = validated_data['config_instance']
        product = validated_data.get('product_instance')

        req = SampleRequest.objects.create(
            campaign=config,
            request_id=SampleRequest.generate_unique_request_id(),
            full_name=validated_data['full_name'].strip(),
            email=validated_data['email'].strip().lower(),
            phone=validated_data['phone'],
            address_line1=validated_data['address_line1'].strip(),
            city=validated_data['city'].strip(),
            state=validated_data['state'].strip(),
            pincode=validated_data['pincode'],
            preferred_product=product,
            preferred_product_name=product.name if product else "Curated Master Perfumer Blend",
            sample_quantity=validated_data.get('sample_quantity', 1),
            status=SampleRequest.Status.PENDING,
        )

        # Ensure VIP coupon exists for subsequent purchase
        now = timezone.now()
        Coupon.objects.get_or_create(
            code='SAMPLEVIP15',
            defaults={
                'discount_type': Coupon.DiscountType.PERCENTAGE,
                'discount_value': 15,
                'min_purchase_amount': 0,
                'valid_from': now,
                'valid_to': now + timezone.timedelta(days=180),
                'usage_limit': 10000,
                'is_active': True
            }
        )

        return req


class SampleRequestAdminSerializer(serializers.ModelSerializer):
    preferred_product_name = serializers.CharField(read_only=True)
    preferred_product_image = serializers.SerializerMethodField()

    class Meta:
        model = SampleRequest
        fields = '__all__'

    def get_preferred_product_image(self, obj):
        if obj.preferred_product:
            first_img = obj.preferred_product.images.filter(is_primary=True).first() or obj.preferred_product.images.first()
            if first_img and first_img.image_url:
                return first_img.image_url
        return '/images/rumera_white_oud_hero.jpg'


class SampleRequestUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SampleRequest
        fields = [
            'status', 'courier_partner', 'tracking_number', 'admin_notes'
        ]

    def update(self, instance, validated_data):
        new_status = validated_data.get('status', instance.status)
        now = timezone.now()

        if new_status == SampleRequest.Status.DISPATCHED and not instance.dispatched_at:
            instance.dispatched_at = now
        elif new_status == SampleRequest.Status.DELIVERED and not instance.delivered_at:
            instance.delivered_at = now

        return super().update(instance, validated_data)

