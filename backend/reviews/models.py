from django.db import models
from django.conf import settings
from products.models import Product

class ProductReview(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    author_name = models.CharField(max_length=100, default='Verified Customer')
    rating = models.IntegerField(default=5) # 1-5
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.rating}★ review for {self.product.name}"

class NearbyShop(models.Model):
    name = models.CharField(max_length=255)
    owner_name = models.CharField(max_length=100)
    category = models.CharField(max_length=100, default='General Store')
    address = models.TextField()
    distance_km = models.FloatField(default=1.2)
    rating = models.FloatField(default=4.8)
    phone = models.CharField(max_length=20, blank=True, null=True)
    is_open = models.BooleanField(default=True)
    image_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['distance_km']

    def __str__(self):
        return f"{self.name} ({self.distance_km} km away)"
