from django.db import transaction
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import StockMovement
from .serializers import StockMovementSerializer, StockAdjustmentSerializer
from catalog.models import ProductVariant
from accounts.permissions import IsStoreManager


class StockMovementListView(generics.ListAPIView):
    serializer_class = StockMovementSerializer
    permission_classes = [IsStoreManager]

    def get_queryset(self):
        queryset = StockMovement.objects.all().select_related('variant__product', 'actor').order_by('-created_at')
        variant_id = self.request.query_params.get('variant')
        if variant_id:
            queryset = queryset.filter(variant_id=variant_id)
        return queryset


class StockAdjustmentView(APIView):
    permission_classes = [IsStoreManager]

    @transaction.atomic
    def post(self, request):
        serializer = StockAdjustmentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        try:
            variant = ProductVariant.objects.select_for_update().get(id=data['variant_id'])
        except ProductVariant.DoesNotExist:
            return Response({"error": "Product variant not found"}, status=status.HTTP_404_NOT_FOUND)

        new_stock = variant.stock_quantity + data['quantity_change']
        if new_stock < 0:
            return Response(
                {"error": f"Cannot deduct {abs(data['quantity_change'])} units. Current stock is {variant.stock_quantity}."},
                status=status.HTTP_400_BAD_REQUEST
            )

        variant.stock_quantity = new_stock
        variant.save(update_fields=['stock_quantity'])

        movement = StockMovement.objects.create(
            variant=variant,
            quantity_change=data['quantity_change'],
            balance_after=new_stock,
            reason=data['reason'],
            notes=data['notes'],
            actor=request.user,
            reference_type='MANUAL_ADJUSTMENT'
        )

        return Response(StockMovementSerializer(movement).data, status=status.HTTP_201_CREATED)
