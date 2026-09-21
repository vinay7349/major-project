import React, { useState, useEffect } from 'react';
import { Routes, Route, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, Package, Boxes, ShoppingCart, BarChart3, 
  Store, Smartphone, RefreshCw, Settings, ChevronLeft, ChevronRight,
  Home, CreditCard, FileText, Calendar, ShieldCheck,
  MapPin, Phone, Mail, User as UserIcon, Camera, PlusCircle,
  Edit3, Trash2, CheckCircle, XCircle, Clock, Filter, Search,
  Star, Percent, Package2, Layers, Grid3X3, Type, StickyNote,
  Activity, BarChart2, PieChart, LineChart, LogOut
} from 'lucide-react';
import { useToast } from '../../context/NotificationContext';

const ShopOwnerApp = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [shopData, setShopData] = useState({
    shop_name: 'My Shop',
    description: 'Your premium retail store',
    address: '123 Main Street, City',
    phone: '+1 234 567 8900',
    email: 'shop@example.com',
    is_open: true,
    categories: ['Electronics', 'Clothing', 'Home & Garden'],
    followers: 145,
    rating: 4.8
  });
  const [isEditing, setIsEditing] = useState(false);

  const OWNER_ROLES = ['SHOP_OWNER', 'ADMIN'];

  const navItems = [
    { path: '/shop-owner/dashboard', label: 'Overview', icon: LayoutDashboard },
    { path: '/shop-owner/products', label: 'Products', icon: Package },
    { path: '/shop-owner/inventory', label: 'Inventory', icon: Boxes },
    { path: '/shop-owner/sales', label: 'Sales', icon: ShoppingCart },
    { path: '/shop-owner/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/shop-owner/shop', label: 'Shop', icon: Store },
    { path: '/shop-owner/app-connection', label: 'App Connection', icon: Smartphone },
    { path: '/shop-owner/updates', label: 'Updates', icon: RefreshCw },
    { path: '/shop-owner/settings', label: 'Settings', icon: Settings },
  ];

  if (!isAuthenticated) {
    navigate('/shop-owner/login', { state: { from: location.pathname } });
    return null;
  }

  if (!OWNER_ROLES.includes(user?.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy p-6 text-center text-slate/60">
        <div className="max-w-md space-y-4">
          <ShieldCheck className="mx-auto h-12 w-12 text-amber-400" />
          <h1 className="text-2xl font-bold">Shop Owner access required</h1>
          <p className="text-sm text-slate/80">
            Your current account role cannot access the Shop Owner Dashboard.
          </p>
          <button
            onClick={() => navigate('/customer')}
            className="rounded-xl bg-amber px-4 py-2.5 text-sm font-bold text-slate-950"
          >
            Open Customer Discovery
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warmwhite dark:bg-navy text-navy dark:text-warmwhite">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 bg-white dark:bg-charcoal border-r border-warmwhite/60 dark:border-charcoal ${
          sidebarOpen ? 'w-64' : 'w-20'
        } lg:translate-x-0`}
        aria-label="Shop Owner Navigation"
      >
        <div className="flex h-full flex-col">
          {/* Logo & Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-warmwhite/60 dark:border-charcoal">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber/20 to-orange-500/20 border border-amber/30">
                <Store className="h-5 w-5 text-amber-400" />
              </div>
              {sidebarOpen && (
                <div>
                  <h1 className="text-lg font-bold text-navy dark:text-white">ShopGenie</h1>
                  <p className="text-xs text-slate/60 dark:text-slate/60">Owner Dashboard</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl text-slate/60 dark:text-slate/60 hover:bg-warmwhite/60 dark:hover:bg-charcoal/60 transition-colors"
              aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto" role="navigation" aria-label="Main navigation">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-amber/10 text-amber-400 border border-amber/20 dark:bg-amber/10 dark:text-amber-300'
                      : 'text-slate/60 dark:text-slate/60 hover:bg-warmwhite/60 dark:hover:bg-charcoal/60 hover:text-navy dark:hover:text-white'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                  {sidebarOpen && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>

          {/* Footer - Shop Info & Logout */}
          <div className="p-4 border-t border-warmwhite/60 dark:border-charcoal">
            {sidebarOpen ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 rounded-xl bg-warmwhite/60 dark:bg-charcoal/60">
                  <Store className="h-4 w-4 text-amber-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-navy dark:text-white truncate">{shopData.shop_name}</p>
                    <p className="text-xs text-slate/60 dark:text-slate/60 truncate">{shopData.address}</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red/60 hover:bg-red/10 dark:text-red/400 dark:hover:bg-red/10 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={logout}
                className="w-full flex justify-center p-2 rounded-xl text-red/60 hover:bg-red/10 dark:text-red/400 dark:hover:bg-red/10 transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 lg:ml-64 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-charcoal/80 backdrop-blur-xl border-b border-warmwhite/60 dark:border-charcoal">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-navy dark:text-white">
                  {navItems.find(n => n.path === location.pathname)?.label || 'Dashboard'}
                </h1>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Mobile menu toggle */}
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 rounded-xl text-slate/60 dark:text-slate/60 hover:bg-warmwhite/60 dark:hover:bg-charcoal/60"
                  aria-label="Toggle menu"
                >
                  {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                </button>
                
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red/10 hover:bg-red/20 dark:bg-red/10 dark:hover:bg-red/20 border border-red/20 dark:border-red/20 text-sm font-medium text-red/60 dark:text-red/400 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ShopOwnerApp;