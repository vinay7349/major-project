from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import StockAlert, RestockLog
from .serializers import StockAlertSerializer, RestockLogSerializer
from products.models import Product

class StockAlertListView(generics.ListAPIView):
    serializer_class = StockAlertSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = StockAlert.objects.filter(is_resolved=False)
        return queryset

class RestockProductView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        product_id = request.data.get('product_id')
        quantity_to_add = int(request.data.get('quantity', 0))
        supplier_name = request.data.get('supplier_name', 'Direct Supplier')
        notes = request.data.get('notes', '')

        if not product_id or quantity_to_add <= 0:
            return Response({"error": "Invalid product or quantity"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

        previous_quantity = product.stock_quantity
        product.stock_quantity += quantity_to_add
        product.save()

        # Log restock event
        log = RestockLog.objects.create(
            product=product,
            quantity_added=quantity_to_add,
            previous_quantity=previous_quantity,
            new_quantity=product.stock_quantity,
            supplier_name=supplier_name,
            notes=notes
        )

        # Resolve low stock alerts if threshold met
        if product.stock_quantity > product.min_stock_level:
            StockAlert.objects.filter(product=product, is_resolved=False).update(is_resolved=True)

        return Response({
            "message": f"Successfully restocked {quantity_to_add} units of {product.name}",
            "new_stock": product.stock_quantity,
            "log": RestockLogSerializer(log).data
        }, status=status.HTTP_200_OK)

class RestockLogListView(generics.ListAPIView):
    queryset = RestockLog.objects.all()
    serializer_class = RestockLogSerializer
    permission_classes = [permissions.AllowAny]
