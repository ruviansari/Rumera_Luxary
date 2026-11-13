from django.urls import path
from .views import (
    ValidateCouponView,
    AdminCouponListCreateView,
    AdminCouponDetailView,
    SampleCampaignPublicConfigView,
    SampleRequestPublicClaimView,
    AdminSampleRequestListView,
    AdminSampleRequestDetailView,
    AdminSampleExportCSVView,
    AdminSampleCampaignConfigView
)

urlpatterns = [
    # Coupon validation & admin
    path('coupons/validate/', ValidateCouponView.as_view(), name='coupon_validate'),
    path('admin/coupons/', AdminCouponListCreateView.as_view(), name='admin_coupon_list_create'),
    path('admin/coupons/<int:pk>/', AdminCouponDetailView.as_view(), name='admin_coupon_detail'),

    # Public Free Sample Campaign endpoints (with and without prefix)
    path('samples/config/', SampleCampaignPublicConfigView.as_view(), name='sample_campaign_config_alias'),
    path('samples/claim/', SampleRequestPublicClaimView.as_view(), name='sample_request_claim_alias'),
    path('promotions/samples/config/', SampleCampaignPublicConfigView.as_view(), name='sample_campaign_config'),
    path('promotions/samples/claim/', SampleRequestPublicClaimView.as_view(), name='sample_request_claim'),

    # Admin Free Sample Campaign endpoints
    path('admin/samples/', AdminSampleRequestListView.as_view(), name='admin_sample_list'),
    path('admin/samples/<int:pk>/', AdminSampleRequestDetailView.as_view(), name='admin_sample_detail'),
    path('admin/samples/export/', AdminSampleExportCSVView.as_view(), name='admin_sample_export'),
    path('admin/samples/campaign-settings/', AdminSampleCampaignConfigView.as_view(), name='admin_sample_campaign_settings'),
]

