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


class AdminCouponDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer
    permission_classes = [IsStoreManager]
