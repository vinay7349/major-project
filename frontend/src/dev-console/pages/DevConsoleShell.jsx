import React, { useState, useEffect } from 'react';
import { ADMIN_SESSION_MINUTES, useDevAuth } from '../context/DevAuthContext';
import { ToastProvider } from '../context/ToastContext';
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
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

import DashboardSection from './sections/DashboardSection';
import ShopsSection from './sections/ShopsSection';
import UsersSection from './sections/UsersSection';
import ProductsSection from './sections/ProductsSection';
import AppSettingsSection from './sections/AppSettingsSection';
import HealthToolsSection from './sections/HealthToolsSection';
import AuditLogsSection from './sections/AuditLogsSection';

const NAV_GROUPS = [
  {
    title: 'Overview',
    items: [
      { id: 'dashboard', label: 'System Overview', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Operations',
    items: [
      { id: 'shops', label: 'Shops Moderation', icon: Store },
      { id: 'users', label: 'Identity & Access', icon: Users },
      { id: 'products', label: 'Catalog & Offers', icon: Package },
    ],
  },
  {
    title: 'Platform',
    items: [
      { id: 'app-settings', label: 'App Remote Controls', icon: Sliders },
      { id: 'health', label: 'Diagnostics & Health', icon: Activity },
      { id: 'audit-logs', label: 'Security Audit Trail', icon: FileText },
    ],
  },
];

const DevConsoleShellContent = () => {
  const { user, logout, sessionExpiryTime } = useDevAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [timeLeftMinutes, setTimeLeftMinutes] = useState(ADMIN_SESSION_MINUTES);

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

  const currentModuleTitle = (() => {
    for (const group of NAV_GROUPS) {
      const match = group.items.find((item) => item.id === activeSection);
      if (match) return match.label;
    }
    return 'System Overview';
  })();

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30">
      {/* Top Header */}
      <header className="h-16 shrink-0 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 md:hidden hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <Terminal className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm tracking-tight text-white">ShopGenie</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                Operations
              </span>
            </div>
          </div>

          {/* Breadcrumb separator on desktop */}
          <div className="hidden sm:flex items-center text-slate-600 space-x-2 pl-2">
            <ChevronRight className="w-4 h-4 text-slate-600" />
            <span className="text-xs font-medium text-slate-300">{currentModuleTitle}</span>
          </div>
        </div>

        {/* Right Info: Status Dot + Idle timer + Developer info + Logout */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Session Timer Badge */}
          <div
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border text-xs ${
              timeLeftMinutes <= 5
                ? 'bg-amber-950/40 text-amber-400 border-amber-800/60 animate-pulse'
                : 'bg-slate-800/80 text-slate-300 border-slate-700/60'
            }`}
            title={`Auto-logout occurs after ${ADMIN_SESSION_MINUTES} minutes of inactivity.`}
          >
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{timeLeftMinutes}m idle</span>
          </div>

          {/* User badge */}
          <div className="flex items-center space-x-2.5 bg-slate-800/60 border border-slate-700/50 px-3 py-1.5 rounded-xl">
            <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-semibold text-xs uppercase">
              {user?.username?.charAt(0) || 'D'}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-semibold text-white leading-none">
                {user?.username || 'Developer'}
              </div>
              <div className="text-xs text-slate-400 leading-none mt-1">
                {user?.email || 'dev@shopgenie.internal'}
              </div>
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={logout}
            title="Sign out of developer console"
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-950/50 text-slate-300 hover:text-rose-400 border border-slate-700/60 hover:border-rose-800/60 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Workspace with Sidebar */}
      <div className="min-h-0 flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="w-64 shrink-0 border-r border-slate-800 bg-slate-900/50 p-4 hidden md:flex flex-col justify-between overflow-y-auto">
          <nav className="space-y-6">
            {NAV_GROUPS.map((group) => (
              <div key={group.title}>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-3 mb-2">
                  {group.title}
                </div>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                          isActive
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                            : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer Card */}
          <div className="pt-4 border-t border-slate-800/60">
            <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl text-xs text-slate-400">
              <div className="text-white font-medium mb-0.5 flex items-center justify-between">
                <span>Database-backed operations</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              </div>
              <p className="text-slate-500 leading-normal">
                Direct write operations are tracked in the append-only audit trail.
              </p>
            </div>
          </div>
        </aside>

        {/* Mobile Flyout Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm md:hidden flex">
            <div className="w-72 shrink-0 bg-slate-900 border-r border-slate-800 p-5 flex flex-col justify-between h-full animate-slide-in">
              <div className="space-y-6 overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-sm font-semibold text-white">Navigation</span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {NAV_GROUPS.map((group) => (
                  <div key={group.title}>
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-3 mb-2">
                      {group.title}
                    </div>
                    <div className="space-y-1">
                      {group.items.map((item) => {
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
                            <Icon className="w-4 h-4 shrink-0" />
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-full mt-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-medium hover:bg-slate-700 transition-colors"
              >
                Close Menu
              </button>
            </div>
          </div>
        )}

        {/* Section Viewport */}
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  );
};

const DevConsoleShell = () => {
  return (
    <ToastProvider>
      <DevConsoleShellContent />
    </ToastProvider>
  );
};

export default DevConsoleShell;
