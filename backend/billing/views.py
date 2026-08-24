import uuid
from decimal import Decimal
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import transaction
from .models import Order, OrderItem
from .serializers import OrderSerializer
from products.models import Product
from inventory.models import StockAlert
from notifications.models import Notification
from accounts.permissions import IsShopOwnerOrAdmin

class OrderListCreateView(APIView):
    permission_classes = [IsShopOwnerOrAdmin]

    def get(self, request):
        orders = Order.objects.all()
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    @transaction.atomic
    def post(self, request):
        data = request.data
        items_data = data.get('items', [])
        
        if not items_data:
            return Response({"error": "No items provided in order"}, status=status.HTTP_400_BAD_REQUEST)

        order_number = f"INV-{uuid.uuid4().hex[:8].upper()}"
        subtotal = Decimal('0.00')

        # Create Order container
        order = Order.objects.create(
            order_number=order_number,
            customer_name=data.get('customer_name', 'Walk-in Customer'),
            customer_phone=data.get('customer_phone', ''),
            cashier=request.user if request.user.is_authenticated else None,
            subtotal=0,
            tax_amount=Decimal(str(data.get('tax_amount', 0))),
            discount_amount=Decimal(str(data.get('discount_amount', 0))),
            total_amount=0,
            payment_method=data.get('payment_method', Order.PaymentMethod.CASH),
            payment_status=Order.Status.COMPLETED
        )

        for item in items_data:
            product_id = item.get('product_id')
            qty = int(item.get('quantity', 1))

            try:
                product = Product.objects.get(id=product_id)
            except Product.DoesNotExist:
                continue

            unit_price = product.price
            total_price = unit_price * qty
            subtotal += total_price

            OrderItem.objects.create(
                order=order,
                product=product,
                product_name=product.name,
                unit_price=unit_price,
                quantity=qty,
                total_price=total_price
            )

            # Deduct inventory stock
            product.stock_quantity = max(0, product.stock_quantity - qty)
            product.save()

            # Trigger Stock Alert & Notification if low stock reached
            if product.stock_quantity <= product.min_stock_level:
                StockAlert.objects.get_or_create(
                    product=product,
                    is_resolved=False,
                    defaults={
                        'alert_level': StockAlert.AlertLevel.WARNING if product.stock_quantity > 0 else StockAlert.AlertLevel.CRITICAL,
                        'message': f"Low stock alert: {product.name} currently has {product.stock_quantity} units remaining."
                    }
                )
                Notification.objects.create(
                    title="Low Stock Warning",
                    message=f"{product.name} is running low ({product.stock_quantity} remaining)",
                    notification_type="STOCK",
                    link=f"/inventory"
                )

        order.subtotal = subtotal
        order.total_amount = subtotal + order.tax_amount - order.discount_amount
        order.save()

        # Sales notification
        Notification.objects.create(
            title="New Order Completed",
            message=f"Invoice #{order.order_number} created for ${order.total_amount}",
            notification_type="SALES",
            link="/billing"
        )

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

class OrderDetailView(generics.RetrieveAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsShopOwnerOrAdmin]

class InvoiceDownloadView(APIView):
    permission_classes = [IsShopOwnerOrAdmin]

    def get(self, request, pk):
        try:
            order = Order.objects.get(pk=pk)
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

        # Returns metadata payload for frontend PDF generator rendering
        return Response({
            "invoice_number": order.order_number,
            "created_at": order.created_at,
            "customer_name": order.customer_name,
            "customer_phone": order.customer_phone,
            "payment_method": order.get_payment_method_display(),
            "payment_status": order.payment_status,
            "subtotal": str(order.subtotal),
            "tax": str(order.tax_amount),
            "discount": str(order.discount_amount),
            "total_amount": str(order.total_amount),
            "items": [
                {
                    "name": item.product_name,
                    "qty": item.quantity,
                    "unit_price": str(item.unit_price),
                    "total": str(item.total_price)
                } for item in order.items.all()
            ],
            "qr_code_payload": f"https://shopgenie.ai/verify-invoice/{order.order_number}"
        })
