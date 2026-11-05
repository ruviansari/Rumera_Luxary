from django.db.models import Q, Min, Avg
from rest_framework import generics, permissions, filters, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Category, Product, ProductVariant, ProductImage, Review, Wishlist
from .serializers import (
    CategorySerializer,
    ProductListSerializer,
    ProductDetailSerializer,
    ProductAdminSerializer,
    ProductVariantSerializer,
    ReviewSerializer,
    WishlistSerializer,
)
from accounts.permissions import IsStoreManager


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.filter(is_active=True).order_by('sort_order', 'name')
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None


class CategoryDetailView(generics.RetrieveAPIView):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'


class ProductListView(generics.ListAPIView):
    serializer_class = ProductListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True, status=Product.Status.ACTIVE).prefetch_related('variants', 'images', 'category')

        # Filters
        category_slug = self.request.query_params.get('category')
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)

        fragrance_family = self.request.query_params.get('fragrance_family')
        if fragrance_family:
            queryset = queryset.filter(fragrance_family__icontains=fragrance_family)

        product_type = self.request.query_params.get('product_type')
        if product_type:
            queryset = queryset.filter(product_type=product_type)

        featured = self.request.query_params.get('featured')
        if featured == 'true':
            queryset = queryset.filter(is_featured=True)

        bestseller = self.request.query_params.get('bestseller')
        if bestseller == 'true':
            queryset = queryset.filter(is_bestseller=True)

        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(sku__icontains=search) |
                Q(slug__icontains=search) |
                Q(short_description__icontains=search) |
                Q(description__icontains=search) |
                Q(category__name__icontains=search) |
                Q(fragrance_family__icontains=search) |
                Q(top_notes__icontains=search) |
                Q(heart_notes__icontains=search) |
                Q(base_notes__icontains=search)
            ).distinct()

        min_price = self.request.query_params.get('min_price')
        if min_price:
            queryset = queryset.filter(variants__price__gte=min_price).distinct()

        max_price = self.request.query_params.get('max_price')
        if max_price:
            queryset = queryset.filter(variants__price__lte=max_price).distinct()

        # Sorting
        ordering = self.request.query_params.get('ordering')
        if ordering == 'price_asc':
            queryset = queryset.annotate(min_p=Min('variants__price')).order_by('min_p')
        elif ordering == 'price_desc':
            queryset = queryset.annotate(min_p=Min('variants__price')).order_by('-min_p')
        elif ordering == 'newest':
            queryset = queryset.order_by('-created_at')
        elif ordering == 'name':
            queryset = queryset.order_by('name')

        return queryset


class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.filter(is_active=True).prefetch_related('variants', 'images', 'category')
    serializer_class = ProductDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'


# Admin Views
class AdminProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = ProductAdminSerializer
    permission_classes = [IsStoreManager]


class AdminProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductAdminSerializer
    permission_classes = [IsStoreManager]


class AdminCategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all().order_by('sort_order', 'name')
    serializer_class = CategorySerializer
    permission_classes = [IsStoreManager]
    pagination_class = None


class AdminCategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsStoreManager]


class ProductReviewsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, slug):
        try:
            product = Product.objects.get(slug=slug)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

        reviews = Review.objects.filter(product=product, is_approved=True)
        avg_rating = reviews.aggregate(Avg('rating'))['rating__avg'] or 5.0
        serializer = ReviewSerializer(reviews, many=True)
        return Response({
            "product_id": product.id,
            "product_name": product.name,
            "average_rating": round(float(avg_rating), 1),
            "review_count": reviews.count(),
            "results": serializer.data
        })

    def post(self, request, slug):
        try:
            product = Product.objects.get(slug=slug)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

        data = request.data.copy()
        data['product'] = product.id
        serializer = ReviewSerializer(data=data)
        if serializer.is_valid():
            serializer.save(product=product, is_verified_buyer=True, is_approved=True)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class WishlistView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        session_key = request.headers.get('X-Session-Key') or request.query_params.get('session_key', '')
        if request.user.is_authenticated:
            items = Wishlist.objects.filter(user=request.user)
        elif session_key:
            items = Wishlist.objects.filter(session_key=session_key)
        else:
            items = Wishlist.objects.none()

        serializer = WishlistSerializer(items, many=True)
        return Response({
            "count": items.count(),
            "results": serializer.data
        })

    def post(self, request):
        product_id = request.data.get('product_id')
        session_key = request.headers.get('X-Session-Key') or request.data.get('session_key', '')
        if not product_id:
            return Response({"error": "product_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        if request.user.is_authenticated:
            existing = Wishlist.objects.filter(user=request.user, product=product).first()
            if existing:
                existing.delete()
                return Response({"message": "Removed from wishlist.", "is_wishlisted": False, "product_id": product.id})
            Wishlist.objects.create(user=request.user, product=product)
            return Response({"message": "Added to your royal wishlist.", "is_wishlisted": True, "product_id": product.id}, status=status.HTTP_201_CREATED)
        else:
            if not session_key:
                return Response({"error": "Session key required for guest wishlist."}, status=status.HTTP_400_BAD_REQUEST)
            existing = Wishlist.objects.filter(session_key=session_key, product=product).first()
            if existing:
                existing.delete()
                return Response({"message": "Removed from wishlist.", "is_wishlisted": False, "product_id": product.id})
            Wishlist.objects.create(session_key=session_key, product=product)
            return Response({"message": "Added to your royal wishlist.", "is_wishlisted": True, "product_id": product.id}, status=status.HTTP_201_CREATED)
