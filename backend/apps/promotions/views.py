from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Coupon
from .serializers import CouponSerializer, ValidateCouponSerializer
from accounts.permissions import IsStoreManager


class ValidateCouponView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ValidateCouponSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        code = serializer.validated_data['code'].strip().upper()
        subtotal = serializer.validated_data['subtotal']

        try:
            coupon = Coupon.objects.get(code__iexact=code)
        except Coupon.DoesNotExist:
            return Response({
                "valid": False,
                "message": "Invalid coupon code.",
                "discount": 0
            }, status=status.HTTP_400_BAD_REQUEST)

        is_valid, msg = coupon.is_valid_for_cart(subtotal)
        if not is_valid:
            return Response({
                "valid": False,
                "message": msg,
                "discount": 0
            }, status=status.HTTP_400_BAD_REQUEST)

        discount = coupon.calculate_discount(subtotal)
        return Response({
            "valid": True,
            "message": "Coupon applied successfully!",
            "code": coupon.code,
            "discount_type": coupon.discount_type,
            "discount": discount
        })


class AdminCouponListCreateView(generics.ListCreateAPIView):
    queryset = Coupon.objects.all().order_by('-created_at')
    serializer_class = CouponSerializer
    permission_classes = [IsStoreManager]


import csv
from django.http import HttpResponse
from django.db.models import Q
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Coupon, SampleCampaignConfig, SampleRequest
from .serializers import (
    CouponSerializer,
    ValidateCouponSerializer,
    SampleCampaignConfigSerializer,
    SampleFragranceItemSerializer,
    SampleRequestPublicCreateSerializer,
    SampleRequestAdminSerializer,
    SampleRequestUpdateSerializer
)
from catalog.models import Product
from accounts.permissions import IsStoreManager, IsOrderFulfilment


class ValidateCouponView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ValidateCouponSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        code = serializer.validated_data['code'].strip().upper()
        subtotal = serializer.validated_data['subtotal']

        try:
            coupon = Coupon.objects.get(code__iexact=code)
        except Coupon.DoesNotExist:
            return Response({
                "valid": False,
                "message": "Invalid coupon code.",
                "discount": 0
            }, status=status.HTTP_400_BAD_REQUEST)

        is_valid, msg = coupon.is_valid_for_cart(subtotal)
        if not is_valid:
            return Response({
                "valid": False,
                "message": msg,
                "discount": 0
            }, status=status.HTTP_400_BAD_REQUEST)

        discount = coupon.calculate_discount(subtotal)
        return Response({
            "valid": True,
            "message": "Coupon applied successfully!",
            "code": coupon.code,
            "discount_type": coupon.discount_type,
            "discount": discount
        })


class AdminCouponListCreateView(generics.ListCreateAPIView):
    queryset = Coupon.objects.all().order_by('-created_at')
    serializer_class = CouponSerializer
    permission_classes = [IsStoreManager]


class AdminCouponDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer
    permission_classes = [IsStoreManager]


# ==============================================================================
# FREE SAMPLE PROMOTION CAMPAIGN VIEWS
# ==============================================================================

class SampleCampaignPublicConfigView(APIView):
    """Returns the live campaign configuration and available fragrances for sampling."""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        config = SampleCampaignConfig.get_config()
        config_data = SampleCampaignConfigSerializer(config).data

        # Available active fragrances for sampling
        eligible_products = Product.objects.filter(
            status=Product.Status.ACTIVE
        ).order_by('category__sort_order', 'name')
        fragrances = SampleFragranceItemSerializer(eligible_products, many=True).data

        return Response({
            "campaign": config_data,
            "available_fragrances": fragrances
        })


class SampleRequestPublicClaimView(APIView):
    """Allows customers to reserve a complimentary luxury sample flacon."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = SampleRequestPublicCreateSerializer(data=request.data)
        if not serializer.is_valid():
            errors = serializer.errors
            first_err = "Invalid submission details."
            for k, v in errors.items():
                if isinstance(v, list) and len(v) > 0:
                    first_err = v[0] if k == 'non_field_errors' else f"{k.replace('_', ' ').capitalize()}: {v[0]}"
                    break
                elif isinstance(v, str):
                    first_err = v
                    break
            return Response({
                "success": False,
                "message": first_err,
                "errors": errors
            }, status=status.HTTP_400_BAD_REQUEST)

        sample_request = serializer.save()

        # Get client IP address
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR')
        if ip:
            sample_request.ip_address = ip
            sample_request.save(update_fields=['ip_address'])

        config = sample_request.campaign or SampleCampaignConfig.get_config()

        return Response({
            "success": True,
            "message": "Your complimentary RUMÉRA luxury flacon sample has been successfully reserved!",
            "request_id": sample_request.request_id,
            "full_name": sample_request.full_name,
            "preferred_fragrance": sample_request.preferred_product_name,
            "status": sample_request.status,
            "created_at": sample_request.created_at,
            "vip_reward": {
                "coupon_code": config.bounce_back_coupon_code,
                "discount_percent": config.bounce_back_discount_percent,
                "message": f"Special Welcome Gift: Apply VIP code '{config.bounce_back_coupon_code}' on your next full-bottle purchase to receive {config.bounce_back_discount_percent}% off immediately!"
            }
        }, status=status.HTTP_201_CREATED)


class AdminSampleRequestListView(generics.ListAPIView):
    """Admin view to inspect all customer sample requests."""
    serializer_class = SampleRequestAdminSerializer
    permission_classes = [IsOrderFulfilment]

    def get_queryset(self):
        qs = SampleRequest.objects.all().order_by('-created_at')
        status_param = self.request.query_params.get('status')
        if status_param:
            status_clean = status_param.strip().upper()
            if status_clean not in ['ALL', 'UNDEFINED', 'NULL', '']:
                qs = qs.filter(status=status_clean)

        search = self.request.query_params.get('search')
        if search:
            search = search.strip()
            if search.lower() not in ['undefined', 'null', '']:
                qs = qs.filter(
                    Q(request_id__icontains=search) |
                    Q(full_name__icontains=search) |
                    Q(email__icontains=search) |
                    Q(phone__icontains=search) |
                    Q(preferred_product_name__icontains=search) |
                    Q(city__icontains=search) |
                    Q(tracking_number__icontains=search)
                )
        return qs


class AdminSampleRequestDetailView(generics.RetrieveUpdateAPIView):
    """Admin view to retrieve, approve, reject, or dispatch sample requests."""
    queryset = SampleRequest.objects.all()
    serializer_class = SampleRequestUpdateSerializer
    permission_classes = [IsOrderFulfilment]

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = SampleRequestAdminSerializer(instance)
        return Response(serializer.data)


class AdminSampleCampaignConfigView(APIView):
    """Admin view to retrieve and update sample campaign settings."""
    permission_classes = [IsStoreManager]

    def get(self, request):
        config = SampleCampaignConfig.get_config()
        serializer = SampleCampaignConfigSerializer(config)
        return Response(serializer.data)

    def patch(self, request):
        config = SampleCampaignConfig.get_config()
        serializer = SampleCampaignConfigSerializer(config, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class AdminSampleExportCSVView(APIView):
    """Admin view to export all sample requests as an Excel-compatible CSV."""
    permission_classes = [IsOrderFulfilment]

    def get(self, request):
        response = HttpResponse(content_type='text/csv; charset=utf-8')
        response['Content-Disposition'] = 'attachment; filename="rumera_free_samples_export.csv"'
        
        # Write UTF-8 BOM so Excel opens Hindi/special characters correctly
        response.write('\ufeff')

        writer = csv.writer(response)
        writer.writerow([
            "Request ID",
            "Created Date",
            "Full Name",
            "Mobile Phone",
            "Email Address",
            "Address",
            "City",
            "State",
            "PIN Code",
            "Preferred Fragrance",
            "Quantity",
            "Status",
            "Courier Partner",
            "Tracking Number",
            "Dispatched At",
            "Delivered At",
            "Admin Notes",
        ])

        qs = SampleRequest.objects.all().order_by('-created_at')
        status_param = request.query_params.get('status')
        if status_param:
            status_clean = status_param.strip().upper()
            if status_clean not in ['ALL', 'UNDEFINED', 'NULL', '']:
                qs = qs.filter(status=status_clean)

        for r in qs:
            writer.writerow([
                r.request_id,
                r.created_at.strftime("%Y-%m-%d %H:%M:%S") if r.created_at else "",
                r.full_name,
                r.phone,
                r.email,
                r.address_line1,
                r.city,
                r.state,
                r.pincode,
                r.preferred_product_name,
                r.sample_quantity,
                r.get_status_display(),
                r.courier_partner or "",
                r.tracking_number or "",
                r.dispatched_at.strftime("%Y-%m-%d %H:%M:%S") if r.dispatched_at else "",
                r.delivered_at.strftime("%Y-%m-%d %H:%M:%S") if r.delivered_at else "",
                r.admin_notes or "",
            ])

        return response

