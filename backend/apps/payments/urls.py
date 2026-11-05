from django.urls import path
from .views import CreateRazorpayOrderView, PaymentVerificationView, PaymentWebhookView

urlpatterns = [
    path('payments/razorpay/create/', CreateRazorpayOrderView.as_view(), name='payment_razorpay_create'),
    path('payments/verify/', PaymentVerificationView.as_view(), name='payment_verify'),
    path('payments/webhook/', PaymentWebhookView.as_view(), name='payment_webhook'),
]
