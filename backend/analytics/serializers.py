from rest_framework import serializers
from .models import DailyMetrics

class DailyMetricsSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyMetrics
        fields = '__all__'
