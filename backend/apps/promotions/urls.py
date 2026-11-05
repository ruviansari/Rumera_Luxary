from django.urls import path
from .views import ValidateCouponView, AdminCouponListCreateView, AdminCouponDetailView

urlpatterns = [
    path('coupons/validate/', ValidateCouponView.as_view(), name='coupon_validate'),
    path('admin/coupons/', AdminCouponListCreateView.as_view(), name='admin_coupon_list_create'),
    path('admin/coupons/<int:pk>/', AdminCouponDetailView.as_view(), name='admin_coupon_detail'),
]
