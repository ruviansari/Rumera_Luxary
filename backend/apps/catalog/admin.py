from django.contrib import admin
from .models import Category, Product, ProductVariant, ProductImage


class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 1


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'is_active', 'sort_order', 'created_at')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name', 'description')
    list_filter = ('is_active',)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'sku', 'category', 'product_type', 'status', 'is_featured', 'is_bestseller', 'is_active')
    list_filter = ('product_type', 'status', 'is_featured', 'is_bestseller', 'is_active', 'category')
    search_fields = ('name', 'sku', 'fragrance_family', 'short_description')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ProductVariantInline, ProductImageInline]


@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    list_display = ('sku', 'product', 'volume_size', 'price', 'compare_at_price', 'stock_quantity', 'low_stock_threshold', 'is_active')
    list_filter = ('is_active', 'volume_size')
    search_fields = ('sku', 'product__name')


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ('product', 'image_url', 'is_primary', 'display_order')
    list_filter = ('is_primary',)
