from django.contrib import admin
from .models import StockAlert, RestockLog

@admin.register(StockAlert)
class StockAlertAdmin(admin.ModelAdmin):
    list_display = ('product', 'alert_level', 'is_resolved', 'created_at')
    list_filter = ('alert_level', 'is_resolved')

@admin.register(RestockLog)
class RestockLogAdmin(admin.ModelAdmin):
    list_display = ('product', 'quantity_added', 'previous_quantity', 'new_quantity', 'supplier_name', 'restocked_at')
