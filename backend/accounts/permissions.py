from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsShopOwnerOrAdmin(BasePermission):
    """Allows shop-management operations only to shop owners and admins."""

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role in ('SHOP_OWNER', 'ADMIN')
        )


class ReadOnlyOrShopOwner(IsShopOwnerOrAdmin):
    """Keeps product discovery public while protecting catalog changes."""

    def has_permission(self, request, view):
        return request.method in SAFE_METHODS or super().has_permission(request, view)
