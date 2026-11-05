from rest_framework import permissions
from .models import User


class IsSuperAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated and (
                request.user.role == User.Role.SUPER_ADMIN or request.user.is_superuser
            )
        )


class IsStoreManager(permissions.BasePermission):
    """Allows Super Admin and Store Manager."""
    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated and (
                request.user.role in [User.Role.SUPER_ADMIN, User.Role.STORE_MANAGER] or
                request.user.is_superuser
            )
        )


class IsOrderFulfilment(permissions.BasePermission):
    """Allows Super Admin, Store Manager, and Order Fulfilment staff."""
    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated and (
                request.user.role in [
                    User.Role.SUPER_ADMIN,
                    User.Role.STORE_MANAGER,
                    User.Role.ORDER_FULFILMENT,
                ] or request.user.is_superuser
            )
        )


class IsContentManager(permissions.BasePermission):
    """Allows Super Admin, Store Manager, and Content Manager."""
    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated and (
                request.user.role in [
                    User.Role.SUPER_ADMIN,
                    User.Role.STORE_MANAGER,
                    User.Role.CONTENT_MANAGER,
                ] or request.user.is_superuser
            )
        )


class IsOwnerOrAdmin(permissions.BasePermission):
    """Allows object owner or admin."""
    def has_object_permission(self, request, view, obj):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.role in [User.Role.SUPER_ADMIN, User.Role.STORE_MANAGER] or request.user.is_superuser:
            return True
        # If model has user field
        if hasattr(obj, 'user'):
            return obj.user == request.user
        return False
