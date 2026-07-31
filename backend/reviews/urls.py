from django.urls import path
from .views import ProductReviewListCreateView, NearbyShopListView

urlpatterns = [
    path('product-reviews/', ProductReviewListCreateView.as_view(), name='product_reviews'),
    path('nearby-shops/', NearbyShopListView.as_view(), name='nearby_shops'),
]
