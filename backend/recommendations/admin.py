from django.contrib import admin
from .models import Recommendation

@admin.register(Recommendation)
class RecommendationAdmin(admin.ModelAdmin):
    list_display = ('product', 'recommended_product', 'rec_type', 'score', 'created_at')
    list_filter = ('rec_type',)
