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


class CommunityPost(models.Model):
    """A short local update that can optionally be attached to a nearby shop."""
    shop = models.ForeignKey(NearbyShop, on_delete=models.SET_NULL, null=True, blank=True, related_name='community_posts')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    author_name = models.CharField(max_length=100, default='Local shopper')
    body = models.TextField(max_length=800)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Post by {self.author_name}: {self.body[:40]}"


class CommunityComment(models.Model):
    post = models.ForeignKey(CommunityPost, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    author_name = models.CharField(max_length=100, default='Local shopper')
    body = models.TextField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Comment by {self.author_name}: {self.body[:40]}"
