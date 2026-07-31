from django.db import models
from products.models import Product

class StockAlert(models.Model):
    class AlertLevel(models.TextChoices):
        CRITICAL = 'CRITICAL', 'Critical Stock'
        WARNING = 'WARNING', 'Low Stock Warning'
        INFO = 'INFO', 'Normal Stock'

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='stock_alerts')
    alert_level = models.CharField(max_length=20, choices=AlertLevel.choices, default=AlertLevel.WARNING)
    message = models.TextField()
    is_resolved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.alert_level} - {self.product.name}"

class RestockLog(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='restock_logs')
    quantity_added = models.IntegerField()
    previous_quantity = models.IntegerField()
    new_quantity = models.IntegerField()
    supplier_name = models.CharField(max_length=255, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    restocked_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-restocked_at']

    def __str__(self):
        return f"Restocked +{self.quantity_added} {self.product.name}"
