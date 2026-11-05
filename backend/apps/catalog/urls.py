from django.urls import path
from .views import (
    CategoryListView,
    CategoryDetailView,
    ProductListView,
    ProductDetailView,
    ProductReviewsView,
    WishlistView,
    AdminProductListCreateView,
    AdminProductDetailView,
    AdminCategoryListCreateView,
    AdminCategoryDetailView,
)

urlpatterns = [
    # Public
    path('categories/', CategoryListView.as_view(), name='category_list'),
    path('categories/<slug:slug>/', CategoryDetailView.as_view(), name='category_detail'),
    path('products/', ProductListView.as_view(), name='product_list'),
    path('products/<slug:slug>/', ProductDetailView.as_view(), name='product_detail'),
    path('products/<slug:slug>/reviews/', ProductReviewsView.as_view(), name='product_reviews'),
    path('wishlist/', WishlistView.as_view(), name='wishlist'),

    # Admin
    path('admin/products/', AdminProductListCreateView.as_view(), name='admin_product_list_create'),
    path('admin/products/<int:pk>/', AdminProductDetailView.as_view(), name='admin_product_detail'),
    path('admin/categories/', AdminCategoryListCreateView.as_view(), name='admin_category_list_create'),
    path('admin/categories/<int:pk>/', AdminCategoryDetailView.as_view(), name='admin_category_detail'),
]
