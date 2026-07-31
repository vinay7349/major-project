from django.contrib import admin
from .models import ProductReview, NearbyShop

@admin.register(ProductReview)
class ProductReviewAdmin(admin.ModelAdmin):
    list_display = ('product', 'author_name', 'rating', 'created_at')
    list_filter = ('rating',)

@admin.register(NearbyShop)
class NearbyShopAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner_name', 'category', 'distance_km', 'rating', 'is_open')
