from rest_framework import serializers
from .models import ProductReview, NearbyShop, CommunityPost, CommunityComment

class ProductReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductReview
        fields = '__all__'

class NearbyShopSerializer(serializers.ModelSerializer):
    class Meta:
        model = NearbyShop
        fields = '__all__'


class CommunityCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommunityComment
        fields = '__all__'
        read_only_fields = ['created_at']


class CommunityPostSerializer(serializers.ModelSerializer):
    comments = CommunityCommentSerializer(many=True, read_only=True)
    comment_count = serializers.IntegerField(source='comments.count', read_only=True)
    shop_name = serializers.CharField(source='shop.name', read_only=True)

    class Meta:
        model = CommunityPost
        fields = ['id', 'shop', 'shop_name', 'user', 'author_name', 'body', 'created_at', 'comments', 'comment_count']
        read_only_fields = ['created_at', 'comments', 'comment_count', 'shop_name']
