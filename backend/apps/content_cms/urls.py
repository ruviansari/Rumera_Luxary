from django.urls import path
from .views import (
    PublicOwnerProfileView,
    PublicContentPageListView,
    PublicContentPageDetailView,
    AdminOwnerProfileView,
    AdminContentPageListCreateView,
    AdminContentPageDetailView,
)

urlpatterns = [
    # Public
    path('content/owner/', PublicOwnerProfileView.as_view(), name='public_owner_profile'),
    path('content/pages/', PublicContentPageListView.as_view(), name='public_content_pages'),
    path('content/pages/<slug:slug>/', PublicContentPageDetailView.as_view(), name='public_content_page_detail'),

    # Admin
    path('admin/content/owner/', AdminOwnerProfileView.as_view(), name='admin_owner_profile'),
    path('admin/content/pages/', AdminContentPageListCreateView.as_view(), name='admin_content_pages_list'),
    path('admin/content/pages/<slug:slug>/', AdminContentPageDetailView.as_view(), name='admin_content_page_detail'),
]
