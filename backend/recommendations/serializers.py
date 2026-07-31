from rest_framework import serializers
from .models import Recommendation
from products.serializers import ProductSerializer

class RecommendationSerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source='product', read_only=True)
    recommended_product_details = ProductSerializer(source='recommended_product', read_only=True)

    class Meta:
        model = Recommendation
        fields = '__all__'
