from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, AuditLog

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('ShopGenie Custom Fields', {'fields': ('role', 'phone_number', 'shop_name', 'address', 'avatar')}),
    )
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'shop_name', 'is_staff')
    list_filter = ('role', 'is_staff', 'is_active')

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('timestamp', 'user', 'action', 'details', 'ip_address')
    list_filter = ('action', 'timestamp')
    search_fields = ('user__username', 'action', 'details')
