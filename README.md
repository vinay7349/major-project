# ShopGenie AI – Intelligent Sales and Inventory Assistant

ShopGenie AI is a modern full-stack web application designed for retail shops, combining Django REST Framework on the backend with React.js (Vite + Tailwind CSS + Recharts) on the frontend. The application includes AI Product Detection, AI Recommendations, Web Speech API Voice Assistant, Analytics, Inventory Management, Billing System, Community Retail Network, and Role-Based JWT Authentication.

---

## 🌟 Key Features

1. **Authentication & Authorization**:
   - Register, Login, Forgot Password, JWT Bearer token sessions.
   - Role-Based Access Control (`ADMIN`, `SHOP_OWNER`, `CUSTOMER`).
   - Audit trail security logging.

2. **Dashboard Overview**:
   - Real-time metric cards (Today's Sales, Monthly Revenue, Total Products, Low Stock Count, Total Orders).
   - Interactive weekly sales revenue area chart & category pie chart.
   - AI predictive 7-day sales forecast model output.

3. **Product Management**:
   - Add, Edit, Delete, Search & Category filtering.
   - Barcode generator & QR tag preview modal.
   - Low stock threshold indicators.

4. **AI Product Detection**:
   - Upload product images or select demo samples.
   - Computer vision detection pipeline using OpenCV feature extraction and YOLO neural vision emulation.
   - Visual bounding box coordinates overlay, confidence score meter, and auto-filling product catalog form.

5. **Smart Inventory Control**:
   - Live stock tracking with color-coded health badges.
   - Automated low stock alerts & critical warnings.
   - Quick restock modal with supplier tracking and restock audit history.
   - Export inventory CSV reports.

6. **POS Billing & Invoices**:
   - Interactive checkout terminal with product search & barcode scanner.
   - Quantity adjustments, subtotal, tax (8%), and discount calculations.
   - Multi-payment options (Cash, Credit Card, UPI / QR Code).
   - Instant printable invoice modal with QR authenticity verification.

7. **AI Recommendation Engine**:
   - Frequently Bought Together item pairings based on co-occurrence algorithms.
   - Similar category products and personalized AI picks.

8. **Web Speech AI Voice Assistant**:
   - Hands-free speech recognition supporting natural navigation ("go to billing", "open inventory", "dark mode").
   - Speech synthesis audio feedback and visual equalizer animation.

9. **Sales & Revenue Analytics**:
   - Revenue vs Gross profit breakdown.
   - Peak store foot traffic and hourly sales volume chart.
   - Customer retention metrics (AOV, Repeat rate, Satisfaction score).

10. **Notification Center**:
    - Low stock alerts, daily milestone notifications, system updates.
    - Read / unread status management and clear all actions.

11. **Community Retail Network**:
    - Directory listing nearby neighborhood shops, ratings, and distances.
    - Product reviews & star ratings system.

12. **Admin Control Panel**:
    - Manage registered users and role permissions.
    - View live security audit log trails.

---

## 📂 Project Architecture

```
major-project/
├── backend/
│   ├── shopgenie/          # Project configuration (settings, urls, wsgi)
│   ├── accounts/           # User model, JWT authentication, audit logs
│   ├── products/           # Categories, Products, AI Detection API
│   ├── inventory/          # Stock tracking, low stock alerts, restock logs
│   ├── billing/            # Orders, Order Items, PDF Invoices
│   ├── recommendations/    # AI product recommendation APIs
│   ├── notifications/      # System notifications and alert triggers
│   ├── analytics/          # Dashboard metrics, sales trends, ML forecast
│   ├── reviews/            # Reviews, ratings, nearby shop network
│   ├── seed_data.py        # Database initial data seeding script
│   ├── manage.py
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── components/     # Navbar, Sidebar, GlassCard, LoadingSkeleton, VoiceAssistantModal, InvoiceModal, BarcodeScannerModal
    │   ├── context/        # AuthContext, ThemeContext, NotificationContext
    │   ├── hooks/          # useVoiceAssistant custom hook
    │   ├── layouts/        # DashboardLayout, MainLayout
    │   ├── pages/          # 15+ full React pages
    │   ├── services/       # Axios API client with JWT interceptors
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

---

## 🚀 Installation & Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js v18+ & npm

### 1. Backend Setup (Django REST Framework)

```bash
cd backend

# Install Python requirements
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Seed database with sample products, categories, sales history & stock alerts
python seed_data.py

# Start Django Development Server (runs on http://127.0.0.1:8000)
python manage.py runserver
```

### PostgreSQL Configuration

Set `DB_ENGINE=postgresql` and provide the database connection settings before running migrations:

```text
DB_ENGINE=postgresql
POSTGRES_DB=shopgenie
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_SSLMODE=prefer
```

The backend uses SQLite when `DB_ENGINE` is not set, which keeps local setup compatible with the included development database. Never commit real credentials; use environment variables or a local `.env` file.

### 2. Frontend Setup (React.js + Vite)

```bash
cd frontend

# Install Node dependencies
npm install

# Start Vite Development Server (runs on http://localhost:3000)
npm run dev
```

---

## 🔑 Demo Account Credentials

- **Shop Owner**: `shopowner` / `owner123`
- **Administrator**: `admin` / `admin123`
- **Customer**: `customer` / `customer123`

---

## 🔗 Backend REST API Endpoints Summary

| Endpoint | Method | Description |
|---|---|---|
| `/api/accounts/register/` | `POST` | Register new user |
| `/api/accounts/login/` | `POST` | JWT Login token obtain |
| `/api/products/` | `GET`, `POST` | List and create products |
| `/api/products/ai-detect/` | `POST` | OpenCV + YOLO product detection |
| `/api/inventory/alerts/` | `GET` | List active low stock warnings |
| `/api/inventory/restock/` | `POST` | Restock product stock quantity |
| `/api/billing/orders/` | `GET`, `POST` | Create order & view sales history |
| `/api/recommendations/` | `GET` | Get AI recommended products |
| `/api/analytics/dashboard/` | `GET` | Live dashboard overview stats |
| `/api/analytics/sales/` | `GET` | Detailed sales & revenue analytics |
| `/api/notifications/` | `GET` | View user notifications |
| `/api/reviews/nearby-shops/` | `GET` | Community retail shop network |
