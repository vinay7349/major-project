from django.db import models

class Notification(models.Model):
    class Type(models.TextChoices):
        STOCK = 'STOCK', 'Low Stock Alert'
        SALES = 'SALES', 'Sales Alert'
        SYSTEM = 'SYSTEM', 'System Alert'
        COMMUNITY = 'COMMUNITY', 'Community Network Update'

    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(max_length=20, choices=Type.choices, default=Type.SYSTEM)
    is_read = models.BooleanField(default=False)
    link = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.notification_type}] {self.title}"
