from rest_framework import serializers
from .models import StockMovement
from catalog.models import ProductVariant


class StockMovementSerializer(serializers.ModelSerializer):
    variant_name = serializers.ReadOnlyField(source='variant.product.name')
    variant_size = serializers.ReadOnlyField(source='variant.volume_size')
    actor_email = serializers.ReadOnlyField(source='actor.email')

    class Meta:
        model = StockMovement
        fields = [
            'id', 'variant', 'variant_name', 'variant_size', 'quantity_change',
            'balance_after', 'reason', 'notes', 'reference_type', 'reference_id',
            'actor_email', 'created_at'
        ]
        read_only_fields = ['balance_after', 'actor_email', 'created_at']


class StockAdjustmentSerializer(serializers.Serializer):
    variant_id = serializers.IntegerField()
    quantity_change = serializers.IntegerField(help_text="Positive to add, negative to deduct")
    reason = serializers.ChoiceField(choices=StockMovement.Reason.choices)
    notes = serializers.CharField(required=True, allow_blank=False, help_text="Reason description is mandatory for adjustments")
