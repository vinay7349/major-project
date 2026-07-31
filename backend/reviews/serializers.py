from rest_framework import serializers
from .models import ProductReview, NearbyShop

class ProductReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductReview
        fields = '__all__'

class NearbyShopSerializer(serializers.ModelSerializer):
    class Meta:
        model = NearbyShop
        fields = '__all__'
