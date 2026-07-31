from django.urls import path
from .views import CategoryListCreateView, CategoryDetailView, ProductListCreateView, ProductDetailView, AIDetectProductView

urlpatterns = [
    path('categories/', CategoryListCreateView.as_view(), name='category_list'),
    path('categories/<int:pk>/', CategoryDetailView.as_view(), name='category_detail'),
    path('', ProductListCreateView.as_view(), name='product_list'),
    path('<int:pk>/', ProductDetailView.as_view(), name='product_detail'),
    path('ai-detect/', AIDetectProductView.as_view(), name='ai_detect'),
]
