from django.urls import path
from .views import (
    CartDetailView,
    CartAddItemView,
    CartUpdateItemView,
    CartClearView,
    AdminAbandonedCartsView,
)

urlpatterns = [
    path('cart/', CartDetailView.as_view(), name='cart_detail'),
    path('cart/items/', CartAddItemView.as_view(), name='cart_add_item'),
    path('cart/items/<int:pk>/', CartUpdateItemView.as_view(), name='cart_update_item'),
    path('cart/clear/', CartClearView.as_view(), name='cart_clear'),
    path('admin/abandoned-carts/', AdminAbandonedCartsView.as_view(), name='admin_abandoned_carts'),
]
