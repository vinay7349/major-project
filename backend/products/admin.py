from django.contrib import admin
from .models import Category, Product

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'icon', 'created_at')
    search_fields = ('name',)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'sku', 'barcode', 'category', 'price', 'stock_quantity', 'min_stock_level', 'is_active')
    list_filter = ('category', 'is_active')
    search_fields = ('name', 'sku', 'barcode')
