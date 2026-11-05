from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    CustomLoginView,
    RegisterView,
    UserProfileView,
    AddressListCreateView,
    AddressDetailView,
    AdminUserListView,
    SendOTPView,
    VerifyOTPView,
)

urlpatterns = [
    path('login/', CustomLoginView.as_view(), name='auth_login'),
    path('refresh/', TokenRefreshView.as_view(), name='auth_refresh'),
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('me/', UserProfileView.as_view(), name='auth_me'),
    path('addresses/', AddressListCreateView.as_view(), name='address_list_create'),
    path('addresses/<int:pk>/', AddressDetailView.as_view(), name='address_detail'),
    path('admin/users/', AdminUserListView.as_view(), name='admin_users_list'),
    path('otp/send/', SendOTPView.as_view(), name='auth_otp_send'),
    path('otp/verify/', VerifyOTPView.as_view(), name='auth_otp_verify'),
]
