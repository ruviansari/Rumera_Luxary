from django.db.models import Sum, Count, Q, F
from django.db import models
from django.utils import timezone
from datetime import timedelta
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import AuditEvent
from .serializers import AuditEventSerializer
from accounts.models import User
from orders.models import Order
from catalog.models import ProductVariant, Product
from accounts.permissions import IsStoreManager


class AuditEventListView(generics.ListAPIView):
    queryset = AuditEvent.objects.all().select_related('actor').order_by('-created_at')
    serializer_class = AuditEventSerializer
    permission_classes = [IsStoreManager]


class AdminDashboardAnalyticsView(APIView):
    permission_classes = [IsStoreManager]

    def get(self, request):
        now = timezone.now()
        start_of_today = now.replace(hour=0, minute=0, second=0, microsecond=0)

        # 1. KPI cards
        orders_today = Order.objects.filter(created_at__gte=start_of_today).count()
        gross_sales = Order.objects.exclude(status=Order.Status.CANCELLED).aggregate(total=Sum('total_amount'))['total'] or 0

        pending_orders = Order.objects.filter(status__in=[Order.Status.PENDING_PAYMENT, Order.Status.PAID, Order.Status.PROCESSING]).count()

        low_stock_count = ProductVariant.objects.filter(
            is_active=True,
            stock_quantity__lte=models.F('low_stock_threshold')
        ).count() if hasattr(models, 'F') else ProductVariant.objects.filter(is_active=True, stock_quantity__lte=5).count()

        total_customers = User.objects.filter(role=User.Role.CUSTOMER).count()

        # 2. Recent orders
        recent_orders = Order.objects.all().order_by('-created_at')[:8].values(
            'id', 'order_number', 'recipient_name', 'email', 'status',
            'payment_method', 'total_amount', 'created_at'
        )

        # 3. Status breakdown
        orders_by_status = list(Order.objects.values('status').annotate(count=Count('id')).order_by('-count'))

        # 4. Low stock variants list
        low_stock_variants = ProductVariant.objects.filter(
            is_active=True,
            stock_quantity__lte=5
        ).select_related('product')[:10].values(
            'id', 'sku', 'volume_size', 'stock_quantity', 'low_stock_threshold',
            product_name=models.F('product__name')
        )

        return Response({
            "kpis": {
                "orders_today": orders_today,
                "gross_sales": float(gross_sales),
                "pending_orders": pending_orders,
                "low_stock_count": low_stock_count,
                "total_customers": total_customers,
            },
            "recent_orders": list(recent_orders),
            "orders_by_status": orders_by_status,
            "low_stock_variants": list(low_stock_variants),
        })
