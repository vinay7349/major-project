from django.db import models

class DailyMetrics(models.Model):
    date = models.DateField(unique=True)
    total_sales = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    total_orders = models.IntegerField(default=0)
    total_profit = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    items_sold = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f"Metrics for {self.date}: ${self.total_sales}"
