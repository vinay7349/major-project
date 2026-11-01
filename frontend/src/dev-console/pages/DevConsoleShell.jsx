import React, { useState, useEffect } from 'react';
import { useDevAuth } from '../context/DevAuthContext';
import {
  LayoutDashboard,
  Store,
  Users,
  Package,
  Sliders,
  Activity,
  FileText,
  LogOut,
  Shield,
  Clock,
  Terminal,
  Menu,
  X,
} from 'lucide-react';

import DashboardSection from './sections/DashboardSection';
import ShopsSection from './sections/ShopsSection';
import UsersSection from './sections/UsersSection';
import ProductsSection from './sections/ProductsSection';
import AppSettingsSection from './sections/AppSettingsSection';
import HealthToolsSection from './sections/HealthToolsSection';
import AuditLogsSection from './sections/AuditLogsSection';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'System Overview', icon: LayoutDashboard },
  { id: 'shops', label: 'Shops Moderation', icon: Store },
  { id: 'users', label: 'Identity & Access', icon: Users },
  { id: 'products', label: 'Catalog & Offers', icon: Package },
  { id: 'app-settings', label: 'App Remote Controls', icon: Sliders },
  { id: 'health', label: 'Diagnostics & Health', icon: Activity },
  { id: 'audit-logs', label: 'Security Audit Trail', icon: FileText },
];

const DevConsoleShell = () => {
  const { user, logout, sessionExpiryTime } = useDevAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [timeLeftMinutes, setTimeLeftMinutes] = useState(30);

  // Inactivity countdown ticker
  useEffect(() => {
    const updateCountdown = () => {
      const remainingMs = Math.max(0, sessionExpiryTime - Date.now());
      const mins = Math.ceil(remainingMs / 60000);
      setTimeLeftMinutes(mins);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 15000);
    return () => clearInterval(interval);
  }, [sessionExpiryTime]);

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardSection onNavigate={setActiveSection} />;
      case 'shops':
        return <ShopsSection />;
      case 'users':
        return <UsersSection />;
      case 'products':
        return <ProductsSection />;
      case 'app-settings':
        return <AppSettingsSection />;
      case 'health':
        return <HealthToolsSection />;
      case 'audit-logs':
        return <AuditLogsSection />;
      default:
        return <DashboardSection onNavigate={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      {/* Top Bar */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 md:hidden hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-white">ShopGenie</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 uppercase tracking-wider font-semibold">
                  Ops Console
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono tracking-tight hidden sm:block">
                SECURE DEVELOPER WORKSTATION
              </div>
            </div>
          </div>
        </div>

        {/* Right Info: Session idle timer + User info + Logout */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Session Timer Badge */}
          <div
            className={`hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono ${
              timeLeftMinutes <= 5
                ? 'bg-amber-950/40 text-amber-400 border-amber-800/60 animate-pulse'
                : 'bg-slate-800/80 text-slate-300 border-slate-700/60'
            }`}
            title="Auto-logout occurs after 30 minutes of inactivity."
          >
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Idle Timeout: {timeLeftMinutes}m</span>
          </div>

          {/* User badge */}
          <div className="flex items-center space-x-2 bg-slate-800/60 border border-slate-700/50 px-3 py-1.5 rounded-xl">
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            <div className="text-right">
              <div className="text-xs font-semibold text-white leading-none">
                {user?.username || 'Developer'}
              </div>
              <div className="text-[10px] text-slate-400 font-mono leading-none mt-1">
                {user?.email || 'dev@shopgenie.internal'}
              </div>
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={logout}
            title="Terminate Session"
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-red-950/60 text-slate-300 hover:text-red-400 border border-slate-700/60 hover:border-red-800/60 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Workspace with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="w-64 border-r border-slate-800 bg-slate-900/50 p-4 hidden md:flex flex-col justify-between">
          <nav className="space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 px-3 mb-2">
              Management Modules
            </div>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl text-[11px] text-slate-500 font-mono">
            <div className="text-slate-400 font-semibold mb-1">Confidential System</div>
            <div>All changes are committed directly to production datastore with audit timestamps.</div>
          </div>
        </aside>

        {/* Mobile Flyout Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden flex">
            <div className="w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col justify-between h-full animate-slide-in">
              <nav className="space-y-1">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 px-3 mb-2">
                  Navigation
                </div>
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveSection(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2 bg-slate-800 text-slate-300 rounded-lg text-xs"
              >
                Close Menu
              </button>
            </div>
          </div>
        )}

        {/* Section Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DevConsoleShell;
