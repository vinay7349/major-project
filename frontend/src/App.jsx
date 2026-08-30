import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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
import LoginPage from './pages/Public/Login/LoginPage';
import RegisterPage from './pages/Public/Register/RegisterPage';
import ForgotPasswordPage from './pages/Public/ForgotPassword/ForgotPasswordPage';

// Customer pages
import CustomerLoginPage from './pages/Customer/Login/CustomerLoginPage';
import CustomerHomePage from './pages/Customer/ProductSearch/CustomerHomePage';
import CustomerProfilePage from './pages/Customer/Profile/CustomerProfilePage';

// Shop Owner pages
import DashboardPage from './pages/ShopOwner/Dashboard/DashboardPage';
import ProductsPage from './pages/ShopOwner/Products/ProductsPage';
import InventoryPage from './pages/ShopOwner/Inventory/InventoryPage';
import BillingPage from './pages/ShopOwner/Billing/BillingPage';
import AIDetectionPage from './pages/ShopOwner/AIDetection/AIDetectionPage';
import RecommendationsPage from './pages/ShopOwner/Recommendations/RecommendationsPage';
import AnalyticsPage from './pages/ShopOwner/Analytics/AnalyticsPage';
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
          <BrowserRouter>
            <Routes>
              {/* Public Routes with Landing Header & Navbar */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<LandingPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="features" element={<FeaturesPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="forgot-password" element={<ForgotPasswordPage />} />
              </Route>

              {/* Dedicated Customer Portal Gateway */}
              <Route path="/customer/login" element={<CustomerLoginPage />} />

              {/* Dedicated Customer Portal Routes with Customer Header Layout */}
              <Route path="/customer" element={<CustomerLayout />}>
                <Route index element={<CustomerHomePage />} />
                <Route path="profile" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><CustomerProfilePage /></ProtectedRoute>} />
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
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="inventory" element={<InventoryPage />} />
                <Route path="billing" element={<BillingPage />} />
                <Route path="ai-detection" element={<AIDetectionPage />} />
                <Route path="recommendations" element={<RecommendationsPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="nearby-shops" element={<NearbyShopsPage />} />
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
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
