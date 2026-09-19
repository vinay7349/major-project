from rest_framework import generics, permissions
from .models import ProductReview, NearbyShop, CommunityPost, CommunityComment
from .serializers import ProductReviewSerializer, NearbyShopSerializer, CommunityPostSerializer, CommunityCommentSerializer

class ProductReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ProductReviewSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = ProductReview.objects.all()
        product_id = self.request.query_params.get('product_id')
        if product_id:
            queryset = queryset.filter(product_id=product_id)
        return queryset

class NearbyShopListView(generics.ListAPIView):
    queryset = NearbyShop.objects.all()
    serializer_class = NearbyShopSerializer
    permission_classes = [permissions.AllowAny]


class CommunityPostListCreateView(generics.ListCreateAPIView):
    serializer_class = CommunityPostSerializer
    permission_classes = [permissions.AllowAny]
    queryset = CommunityPost.objects.select_related('shop').prefetch_related('comments').all()


class CommunityCommentCreateView(generics.CreateAPIView):
    serializer_class = CommunityCommentSerializer
    permission_classes = [permissions.AllowAny]
