from rest_framework import serializers
from .models import Category, Product, ProductVariant, ProductImage, Review, Wishlist


class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image_url', 'is_active', 'sort_order', 'product_count']

    def get_product_count(self, obj):
        return obj.products.filter(is_active=True).count()


class ProductVariantSerializer(serializers.ModelSerializer):
    in_stock = serializers.ReadOnlyField()

    class Meta:
        model = ProductVariant
        fields = [
            'id', 'volume_size', 'sku', 'price', 'compare_at_price',
            'stock_quantity', 'low_stock_threshold', 'is_active', 'in_stock'
        ]


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image_url', 'alt_text', 'display_order', 'is_primary']


class ProductListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    primary_image = serializers.ReadOnlyField()
    base_price = serializers.ReadOnlyField()
    variants = ProductVariantSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'sku', 'category', 'product_type',
            'short_description', 'fragrance_family', 'concentration',
            'primary_image', 'base_price', 'is_featured', 'is_bestseller',
            'variants'
        ]


class ProductDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    primary_image = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'sku', 'category', 'product_type', 'status',
            'short_description', 'description', 'fragrance_family', 'concentration',
            'top_notes', 'heart_notes', 'base_notes', 'usage_instructions', 'ingredients',
            'is_featured', 'is_bestseller', 'is_active', 'meta_title', 'meta_description',
            'primary_image', 'variants', 'images', 'created_at', 'updated_at'
        ]


class ProductAdminSerializer(serializers.ModelSerializer):
    variants = ProductVariantSerializer(many=True, required=False)
    images = ProductImageSerializer(many=True, required=False)

    class Meta:
        model = Product
        fields = '__all__'

    def create(self, validated_data):
        variants_data = validated_data.pop('variants', [])
        images_data = validated_data.pop('images', [])
        product = Product.objects.create(**validated_data)

        for variant_data in variants_data:
            ProductVariant.objects.create(product=product, **variant_data)

        for image_data in images_data:
            ProductImage.objects.create(product=product, **image_data)

        return product

    def update(self, instance, validated_data):
        variants_data = validated_data.pop('variants', None)
        images_data = validated_data.pop('images', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if variants_data is not None:
            for variant_data in variants_data:
                variant_id = variant_data.get('id')
                if variant_id:
                    ProductVariant.objects.filter(id=variant_id, product=instance).update(**variant_data)
                else:
                    ProductVariant.objects.create(product=instance, **variant_data)

        if images_data is not None:
            for image_data in images_data:
                image_id = image_data.get('id')
                if image_id:
                    ProductImage.objects.filter(id=image_id, product=instance).update(**image_data)
                else:
                    ProductImage.objects.create(product=instance, **image_data)

        return instance


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = [
            'id', 'product', 'name', 'city', 'rating',
            'headline', 'comment', 'is_verified_buyer', 'created_at'
        ]
        read_only_fields = ['id', 'is_verified_buyer', 'created_at']


class WishlistSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Wishlist
        fields = ['id', 'product', 'product_id', 'created_at']
        read_only_fields = ['id', 'created_at']
