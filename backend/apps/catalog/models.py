from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    name = models.CharField(max_length=150, unique=True)
    slug = models.SlugField(max_length=160, unique=True, blank=True)
    description = models.TextField(blank=True)
    image_url = models.CharField(max_length=500, blank=True, help_text="Image URL or relative path")
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'categories'
        ordering = ['sort_order', 'name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Product(models.Model):
    class ProductType(models.TextChoices):
        ATTAR = 'ATTAR', 'Attar / Itra'
        PERFUME = 'PERFUME', 'Perfume (Spray)'
        GIFT_SET = 'GIFT_SET', 'Luxury Gift Set'
        ACCESSORY = 'ACCESSORY', 'Accessory / Crystal Bottle'

    class Status(models.TextChoices):
        DRAFT = 'DRAFT', 'Draft'
        ACTIVE = 'ACTIVE', 'Active'
        ARCHIVED = 'ARCHIVED', 'Archived'

    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='products')
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=270, unique=True, blank=True)
    sku = models.CharField(max_length=100, unique=True)
    product_type = models.CharField(
        max_length=50,
        choices=ProductType.choices,
        default=ProductType.ATTAR
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE
    )
    short_description = models.CharField(max_length=300, blank=True)
    description = models.TextField()
    fragrance_family = models.CharField(
        max_length=100,
        help_text="e.g. Pure Oud, Royal Floral, Amber Oriental, Woody, Warm Spice",
        blank=True
    )
    concentration = models.CharField(
        max_length=100,
        help_text="e.g. 100% Pure Non-Alcoholic Concentrated Perfume Oil, Extrait de Parfum",
        blank=True
    )
    top_notes = models.CharField(max_length=255, blank=True, help_text="Initial scent impression")
    heart_notes = models.CharField(max_length=255, blank=True, help_text="Heart/middle character of scent")
    base_notes = models.CharField(max_length=255, blank=True, help_text="Long-lasting foundation trail")
    usage_instructions = models.TextField(blank=True, help_text="How to apply (pulse points, garment instructions)")
    ingredients = models.TextField(blank=True)

    is_featured = models.BooleanField(default=False)
    is_bestseller = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    meta_title = models.CharField(max_length=255, blank=True)
    meta_description = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_featured', '-is_bestseller', '-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.sku})"

    @property
    def primary_image(self):
        primary = self.images.filter(is_primary=True).first()
        if not primary:
            primary = self.images.first()
        return primary.image_url if primary else ""

    @property
    def base_price(self):
        variant = self.variants.filter(is_active=True).order_by('price').first()
        return variant.price if variant else 0


class ProductVariant(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    volume_size = models.CharField(max_length=50, help_text="e.g. 3 ml, 6 ml, 12 ml, 50 ml")
    sku = models.CharField(max_length=100, unique=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, help_text="Price in INR")
    compare_at_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    stock_quantity = models.PositiveIntegerField(default=10)
    low_stock_threshold = models.PositiveIntegerField(default=5)
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ('product', 'volume_size')
        ordering = ['price']

    def __str__(self):
        return f"{self.product.name} - {self.volume_size} (₹{self.price})"

    @property
    def in_stock(self):
        return self.stock_quantity > 0


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image_url = models.CharField(max_length=500, help_text="Full or relative image URL")
    alt_text = models.CharField(max_length=255, blank=True)
    display_order = models.PositiveIntegerField(default=0)
    is_primary = models.BooleanField(default=False)

    class Meta:
        ordering = ['display_order', 'id']

    def __str__(self):
        return f"Image for {self.product.name}"


class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    name = models.CharField(max_length=150)
    email = models.EmailField(blank=True)
    city = models.CharField(max_length=120, blank=True, help_text="e.g. Mumbai, New Delhi, Dubai")
    rating = models.PositiveSmallIntegerField(default=5)
    headline = models.CharField(max_length=200, blank=True)
    comment = models.TextField()
    is_verified_buyer = models.BooleanField(default=True)
    is_approved = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.rating}★ review by {self.name} for {self.product.name}"


class Wishlist(models.Model):
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, null=True, blank=True, related_name='wishlist_items')
    session_key = models.CharField(max_length=100, blank=True, db_index=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='wishlisted_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Wishlist: {self.product.name}"
