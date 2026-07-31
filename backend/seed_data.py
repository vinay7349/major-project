import os
import sys
import django
import random
from decimal import Decimal

# Setup Django Environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shopgenie.settings')
django.setup()

from django.contrib.auth import get_user_model
from products.models import Category, Product
from inventory.models import StockAlert, RestockLog
from billing.models import Order, OrderItem
from recommendations.models import Recommendation
from notifications.models import Notification
from reviews.models import ProductReview, NearbyShop

User = get_user_model()

def seed_database():
    print("[INIT] Seeding ShopGenie AI Database...")

    # 1. Create Default Users
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@shopgenie.ai', 'admin123', first_name='System', last_name='Admin', role=User.Role.ADMIN, shop_name='ShopGenie Flagship')
        print("[OK] Admin user created (admin / admin123)")

    if not User.objects.filter(username='shopowner').exists():
        User.objects.create_user('shopowner', 'owner@shopgenie.ai', 'owner123', first_name='Alex', last_name='Morgan', role=User.Role.SHOP_OWNER, shop_name='Genie Mart Downtown', phone_number='+1 (555) 234-5678', address='742 Evergreen Terrace, Springfield')
        print("[OK] Shop Owner created (shopowner / owner123)")

    if not User.objects.filter(username='customer').exists():
        User.objects.create_user('customer', 'customer@gmail.com', 'customer123', first_name='Sarah', last_name='Jenkins', role=User.Role.CUSTOMER)
        print("[OK] Customer user created (customer / customer123)")

    # 2. Categories
    categories_data = [
        {"name": "Beverages & Drinks", "icon": "coffee", "description": "Soft drinks, artisan coffees, teas, and fresh juices"},
        {"name": "Snacks & Confectionery", "icon": "cookie", "description": "Chips, chocolates, biscuits, and energy bars"},
        {"name": "Dairy & Breakfast", "icon": "milk", "description": "Milk, cheese, butter, yogurt, and cereals"},
        {"name": "Fresh Produce", "icon": "apple", "description": "Organic fruits and fresh farm vegetables"},
        {"name": "Personal Care", "icon": "smile", "description": "Soaps, shampoos, skincare, and hygiene products"},
        {"name": "Household Supplies", "icon": "home", "description": "Detergents, cleaning sprays, paper towels"},
    ]

    category_objs = {}
    for cat in categories_data:
        obj, _ = Category.objects.get_or_create(name=cat["name"], defaults={"icon": cat["icon"], "description": cat["description"]})
        category_objs[cat["name"]] = obj

    print("[OK] Categories created")

    # 3. Products
    products_data = [
        {"name": "Organic Almond Milk 1L", "sku": "BEV-ALM-001", "barcode": "8901234567891", "category": "Dairy & Breakfast", "price": 4.99, "cost_price": 2.80, "stock": 42, "min_stock": 10, "url": "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80"},
        {"name": "Artisan Cold Brew Coffee 330ml", "sku": "BEV-COF-002", "barcode": "8901234567892", "category": "Beverages & Drinks", "price": 3.75, "cost_price": 1.50, "stock": 4, "min_stock": 10, "url": "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80"},
        {"name": "Dark Chocolate Sea Salt Bar 100g", "sku": "SNK-CHO-003", "barcode": "8901234567893", "category": "Snacks & Confectionery", "price": 2.99, "cost_price": 1.10, "stock": 65, "min_stock": 15, "url": "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80"},
        {"name": "Avocado Hass Fresh (Pack of 3)", "sku": "PRD-AVO-004", "barcode": "8901234567894", "category": "Fresh Produce", "price": 5.49, "cost_price": 3.10, "stock": 2, "min_stock": 8, "url": "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80"},
        {"name": "Greek Honey Yogurt 500g", "sku": "DRY-YOG-005", "barcode": "8901234567895", "category": "Dairy & Breakfast", "price": 3.89, "cost_price": 2.00, "stock": 28, "min_stock": 8, "url": "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80"},
        {"name": "Botanical Body Wash Lavender 500ml", "sku": "CAR-WAS-006", "barcode": "8901234567896", "category": "Personal Care", "price": 8.99, "cost_price": 4.50, "stock": 18, "min_stock": 5, "url": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80"},
        {"name": "Eco Multi-Surface Spray 750ml", "sku": "HSH-SPR-007", "barcode": "8901234567897", "category": "Household Supplies", "price": 6.49, "cost_price": 3.00, "stock": 3, "min_stock": 10, "url": "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?auto=format&fit=crop&w=600&q=80"},
        {"name": "Gluten-Free Granola Oats 400g", "sku": "DRY-GRA-008", "barcode": "8901234567898", "category": "Dairy & Breakfast", "price": 6.29, "cost_price": 3.40, "stock": 50, "min_stock": 12, "url": "https://images.unsplash.com/photo-1517093157656-b9ecedd173ac?auto=format&fit=crop&w=600&q=80"}
    ]

    product_objs = []
    for p in products_data:
        prod, _ = Product.objects.get_or_create(
            sku=p["sku"],
            defaults={
                "name": p["name"],
                "barcode": p["barcode"],
                "category": category_objs[p["category"]],
                "price": Decimal(str(p["price"])),
                "cost_price": Decimal(str(p["cost_price"])),
                "stock_quantity": p["stock"],
                "min_stock_level": p["min_stock"],
                "image_url": p["url"],
                "description": f"Premium quality {p['name']} sourced directly for optimal freshness."
            }
        )
        product_objs.append(prod)

    print("[OK] Products created")

    # 4. Stock Alerts
    for p in product_objs:
        if p.stock_quantity <= p.min_stock_level:
            StockAlert.objects.get_or_create(
                product=p,
                is_resolved=False,
                defaults={
                    "alert_level": StockAlert.AlertLevel.CRITICAL if p.stock_quantity <= 2 else StockAlert.AlertLevel.WARNING,
                    "message": f"Critical low inventory: Only {p.stock_quantity} units left of {p.name}."
                }
            )

    print("[OK] Stock alerts created")

    # 5. Orders & Billing History
    if Order.objects.count() == 0:
        for idx in range(1, 15):
            ord_num = f"INV-2026-00{idx}"
            p_sample = random.sample(product_objs, 2)
            sub = sum(p.price * 2 for p in p_sample)

            order = Order.objects.create(
                order_number=ord_num,
                customer_name=f"Customer #{idx * 102}",
                customer_phone="+1 555-0199",
                subtotal=sub,
                tax_amount=sub * Decimal('0.08'),
                discount_amount=Decimal('0.00'),
                total_amount=sub * Decimal('1.08'),
                payment_method=random.choice([Order.PaymentMethod.CASH, Order.PaymentMethod.UPI, Order.PaymentMethod.CARD]),
                payment_status=Order.Status.COMPLETED
            )
            for item in p_sample:
                OrderItem.objects.create(
                    order=order,
                    product=item,
                    product_name=item.name,
                    unit_price=item.price,
                    quantity=2,
                    total_price=item.price * 2
                )
        print("[OK] Sample Orders & Billing History created")

    # 6. Recommendations
    if len(product_objs) >= 4:
        Recommendation.objects.get_or_create(
            product=product_objs[0],
            recommended_product=product_objs[1],
            defaults={"rec_type": Recommendation.Type.FREQUENTLY_BOUGHT, "score": 0.94}
        )
        Recommendation.objects.get_or_create(
            product=product_objs[0],
            recommended_product=product_objs[4],
            defaults={"rec_type": Recommendation.Type.SIMILAR, "score": 0.88}
        )
        Recommendation.objects.get_or_create(
            product=product_objs[2],
            recommended_product=product_objs[1],
            defaults={"rec_type": Recommendation.Type.PERSONALIZED, "score": 0.91}
        )
        print("[OK] Recommendations seeded")

    # 7. Notifications
    notifications_list = [
        {"title": "Low Stock Warning: Cold Brew Coffee", "message": "Only 4 units left in main store storage.", "type": "STOCK", "link": "/inventory"},
        {"title": "Low Stock Warning: Hass Avocado", "message": "Critical: Only 2 units left!", "type": "STOCK", "link": "/inventory"},
        {"title": "Daily Sales Milestone", "message": "Congratulations! Today's sales crossed $1,500 target.", "type": "SALES", "link": "/analytics"},
        {"title": "System Update Complete", "message": "ShopGenie AI v2.4 successfully deployed.", "type": "SYSTEM", "link": "/dashboard"},
    ]
    for n in notifications_list:
        Notification.objects.get_or_create(title=n["title"], defaults={"message": n["message"], "notification_type": n["type"], "link": n["link"]})
    print("[OK] Notifications seeded")

    # 8. Product Reviews & Nearby Shops
    if len(product_objs) > 0:
        ProductReview.objects.get_or_create(
            product=product_objs[0],
            author_name="David R.",
            rating=5,
            defaults={"comment": "Super fresh almond milk! Tastes amazing with morning oatmeal."}
        )
        ProductReview.objects.get_or_create(
            product=product_objs[1],
            author_name="Elena M.",
            rating=5,
            defaults={"comment": "The cold brew caffeine boost is unbeatable. Great packaging!"}
        )

    shops = [
        {"name": "Metro Gourmet Corner", "owner": "Robert Chen", "category": "Deli & Organic", "distance": 0.6, "rating": 4.9, "phone": "+1 555-9011"},
        {"name": "Green Valley Organics", "owner": "Maria Santos", "category": "Fresh Produce", "distance": 1.4, "rating": 4.7, "phone": "+1 555-9022"},
        {"name": "Apex QuickMart 24/7", "owner": "Vikram Patel", "category": "Convenience Store", "distance": 2.1, "rating": 4.6, "phone": "+1 555-9033"},
    ]
    for s in shops:
        NearbyShop.objects.get_or_create(name=s["name"], defaults={"owner_name": s["owner"], "category": s["category"], "distance_km": s["distance"], "rating": s["rating"], "phone": s["phone"], "address": "Market Street, Sector 4"})

    print("[OK] Reviews and Nearby Shops created")
    print("[SUCCESS] ShopGenie AI Database successfully seeded!")

if __name__ == '__main__':
    seed_database()
