from django.urls import path
from .views import StockAlertListView, RestockProductView, RestockLogListView

urlpatterns = [
    path('alerts/', StockAlertListView.as_view(), name='stock_alerts'),
    path('restock/', RestockProductView.as_view(), name='restock_product'),
    path('logs/', RestockLogListView.as_view(), name='restock_logs'),
]
