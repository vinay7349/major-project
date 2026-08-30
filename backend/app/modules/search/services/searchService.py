from products.models import Product


def get_searchable_products(search_query=''):
    queryset = Product.objects.filter(is_active=True)
    if search_query:
        query = search_query.strip()
        queryset = queryset.filter(
            name__icontains=query
        ) | queryset.filter(
            category_name__icontains=query
        )
    return queryset.order_by('-created_at')
