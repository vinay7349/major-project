from django.urls import path
from .views import DashboardOverviewView, DetailedSalesAnalyticsView

urlpatterns = [
    path('dashboard/', DashboardOverviewView.as_view(), name='dashboard_overview'),
    path('sales/', DetailedSalesAnalyticsView.as_view(), name='sales_analytics'),
]
