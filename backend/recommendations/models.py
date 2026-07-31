from django.db import models
from products.models import Product

class Recommendation(models.Model):
    class Type(models.TextChoices):
        FREQUENTLY_BOUGHT = 'FREQUENTLY_BOUGHT', 'Frequently Bought Together'
        SIMILAR = 'SIMILAR', 'Similar Product'
        PERSONALIZED = 'PERSONALIZED', 'Personalized Pick'

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='recommendations_from')
    recommended_product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='recommendations_to')
    score = models.FloatField(default=0.85)
    rec_type = models.CharField(max_length=30, choices=Type.choices, default=Type.FREQUENTLY_BOUGHT)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-score']

    def __str__(self):
        return f"{self.product.name} -> {self.recommended_product.name} ({self.rec_type})"
