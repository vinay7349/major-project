from django.contrib import admin
from .models import DailyMetrics

@admin.register(DailyMetrics)
class DailyMetricsAdmin(admin.ModelAdmin):
    list_display = ('date', 'total_sales', 'total_orders', 'total_profit', 'items_sold')
