from django.urls import path
from .views import AuditEventListView, AdminDashboardAnalyticsView

urlpatterns = [
    path('admin/audit-logs/', AuditEventListView.as_view(), name='admin_audit_logs'),
    path('admin/analytics/dashboard/', AdminDashboardAnalyticsView.as_view(), name='admin_dashboard_analytics'),
]
