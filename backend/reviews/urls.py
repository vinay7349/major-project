from django.urls import path
from .views import ProductReviewListCreateView, NearbyShopListView, CommunityPostListCreateView, CommunityCommentCreateView

urlpatterns = [
    path('product-reviews/', ProductReviewListCreateView.as_view(), name='product_reviews'),
    path('nearby-shops/', NearbyShopListView.as_view(), name='nearby_shops'),
    path('community-posts/', CommunityPostListCreateView.as_view(), name='community_posts'),
    path('community-comments/', CommunityCommentCreateView.as_view(), name='community_comments'),
]
