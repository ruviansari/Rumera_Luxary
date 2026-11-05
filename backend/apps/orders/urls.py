from django.urls import path
from .views import (
    CheckoutView,
    CustomerOrderListView,
    CustomerOrderDetailView,
    OrderTrackView,
    AdminOrderListView,
    AdminOrderDetailView,
    AdminOrderStatusUpdateView,
    AdminShiprocketDispatchView,
)

urlpatterns = [
    # Public & Customer
    path('checkout/', CheckoutView.as_view(), name='order_checkout'),
    path('orders/me/', CustomerOrderListView.as_view(), name='customer_orders_list'),
    path('orders/track/', OrderTrackView.as_view(), name='order_track'),
    path('orders/<str:order_number>/', CustomerOrderDetailView.as_view(), name='customer_order_detail'),

    # Admin
    path('admin/orders/', AdminOrderListView.as_view(), name='admin_orders_list'),
    path('admin/orders/<str:order_number>/', AdminOrderDetailView.as_view(), name='admin_order_detail'),
    path('admin/orders/<str:order_number>/status/', AdminOrderStatusUpdateView.as_view(), name='admin_order_status_update'),
    path('admin/orders/<int:pk>/shiprocket-dispatch/', AdminShiprocketDispatchView.as_view(), name='admin_order_shiprocket_dispatch'),
]
