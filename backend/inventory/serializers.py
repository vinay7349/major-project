from rest_framework import serializers
from .models import StockAlert, RestockLog
from products.serializers import ProductSerializer

class StockAlertSerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source='product', read_only=True)

    class Meta:
        model = StockAlert
        fields = '__all__'

class RestockLogSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')

    class Meta:
        model = RestockLog
        fields = '__all__'
