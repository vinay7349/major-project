import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { LocationProvider } from './context/LocationContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/common/ProtectedRoute';

import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import CustomerLayout from './layouts/CustomerLayout';

// Public pages
import LandingPage from './pages/Public/Landing/LandingPage';
import AboutPage from './pages/Public/About/AboutPage';
import FeaturesPage from './pages/Public/Features/FeaturesPage';
import RegisterPage from './pages/Public/Register/RegisterPage';
import ForgotPasswordPage from './pages/Public/ForgotPassword/ForgotPasswordPage';

// Customer pages
import CustomerLoginPage from './pages/Customer/Login/CustomerLoginPage';
import ProductDiscoveryPage from './pages/Customer/ProductSearch/ProductDiscoveryPage';
import ProductDiscoveryPageV2 from './pages/Customer/ProductSearch/ProductDiscoveryPageV2';
import CustomerProfilePage from './pages/Customer/Profile/CustomerProfilePage';
import SavedPage from './pages/Customer/Profile/SavedPage';
import CartPage from './pages/Customer/Profile/CartPage';

// Shop Owner pages
import ShopOwnerApp from './pages/ShopOwner/ShopOwnerApp';
import ShopOwnerLoginPage from './pages/ShopOwner/ShopOwnerLoginPage';
import ShopOwnerDashboardPage from './pages/ShopOwner/DashboardPage';
import ProductsPage from './pages/ShopOwner/Products/ProductsPage';
import InventoryPage from './pages/ShopOwner/Inventory/InventoryPage';
import SalesPage from './pages/ShopOwner/Sales/SalesPage';
import AnalyticsPage from './pages/ShopOwner/Analytics/AnalyticsPage';
import ShopProfilePage from './pages/ShopOwner/ShopProfile/ShopProfilePage';
import AppConnectionPage from './pages/ShopOwner/AppConnection/AppConnectionPage';
import UpdatesPage from './pages/ShopOwner/Updates/UpdatesPage';
import NotificationsPage from './pages/ShopOwner/Notifications/NotificationsPage';
import ProfilePage from './pages/ShopOwner/Profile/ProfilePage';
import SettingsPage from './pages/ShopOwner/Settings/SettingsPage';
import NearbyShopsPage from './pages/ShopOwner/NearbyShops/NearbyShopsPage';

// Admin pages
import AdminPanelPage from './pages/Admin/AdminPanel/AdminPanelPage';

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <LocationProvider>
              <BrowserRouter>
            <Routes>
              {/* Public Routes with Landing Header & Navbar */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<LandingPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="features" element={<FeaturesPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="forgot-password" element={<ForgotPasswordPage />} />
              </Route>

              {/* Dedicated Customer Portal Gateway */}
              <Route path="/customer/login" element={<CustomerLoginPage />} />

              {/* Dedicated Shop Owner Login Gateway */}
              <Route path="/shop-owner/login" element={<ShopOwnerLoginPage />} />

              {/* Dedicated Customer Portal Routes with Customer Header Layout */}
              <Route path="/customer" element={<CustomerLayout />}>
                <Route index element={<ProductDiscoveryPageV2 />} />
                <Route path="profile" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><CustomerProfilePage /></ProtectedRoute>} />
                <Route path="saved" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><SavedPage /></ProtectedRoute>} />
                <Route path="cart" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><CartPage /></ProtectedRoute>} />
              </Route>

              {/* Dedicated Shop Owner Portal Routes */}
              <Route path="/shop-owner" element={<ShopOwnerApp />}>
                <Route index element={<Navigate to="/shop-owner/dashboard" replace />} />
                <Route path="dashboard" element={<ShopOwnerDashboardPage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="inventory" element={<InventoryPage />} />
                <Route path="sales" element={<SalesPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="shop" element={<ShopProfilePage />} />
                <Route path="app-connection" element={<AppConnectionPage />} />
                <Route path="updates" element={<UpdatesPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="nearby-shops" element={<NearbyShopsPage />} />
              </Route>

              {/* Protected Dashboard Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute allowedRoles={['SHOP_OWNER', 'ADMIN']}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<Navigate to="/shop-owner/dashboard" replace />} />
                <Route path="products" element={<Navigate to="/shop-owner/products" replace />} />
                <Route path="inventory" element={<Navigate to="/shop-owner/inventory" replace />} />
                <Route path="billing" element={<Navigate to="/shop-owner/billing" replace />} />
                <Route path="ai-detection" element={<Navigate to="/shop-owner/ai-detection" replace />} />
                <Route path="recommendations" element={<Navigate to="/shop-owner/recommendations" replace />} />
                <Route path="analytics" element={<Navigate to="/shop-owner/analytics" replace />} />
                <Route path="notifications" element={<Navigate to="/shop-owner/notifications" replace />} />
                <Route path="profile" element={<Navigate to="/shop-owner/profile" replace />} />
                <Route path="settings" element={<Navigate to="/shop-owner/settings" replace />} />
                <Route path="nearby-shops" element={<Navigate to="/shop-owner/nearby-shops" replace />} />
                <Route path="admin-panel" element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminPanelPage />
                  </ProtectedRoute>
                } />
              </Route>

              {/* Fallback redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
              </BrowserRouter>
            </LocationProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
