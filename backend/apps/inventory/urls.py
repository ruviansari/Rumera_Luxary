from django.urls import path
from .views import StockMovementListView, StockAdjustmentView

urlpatterns = [
    path('admin/inventory/movements/', StockMovementListView.as_view(), name='stock_movements_list'),
    path('admin/inventory/adjust/', StockAdjustmentView.as_view(), name='stock_adjust'),
]
