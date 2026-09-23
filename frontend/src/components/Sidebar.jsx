import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Boxes,
  Receipt,
  Scan,
  Sparkles,
  BarChart3,
  Bell,
  Store,
  ShieldCheck,
  Settings,
  Bot
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose, isVoiceOpen, setIsVoiceOpen }) => {
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Products', path: '/products', icon: Package },
    { label: 'Inventory', path: '/inventory', icon: Boxes },
    { label: 'Billing System', path: '/billing', icon: Receipt },
    { label: 'AI Product Detection', path: '/ai-detection', icon: Scan, badge: 'AI' },
    { label: 'Recommendations', path: '/recommendations', icon: Sparkles },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Notifications', path: '/notifications', icon: Bell },
    { label: 'Nearby Shops', path: '/nearby-shops', icon: Store },
    { label: 'System Admin Panel', path: '/admin-panel', icon: ShieldCheck },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`lg:hidden fixed inset-0 z-40 bg-overlay backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      />
      <aside className={`fixed lg:sticky top-0 left-0 z-50 w-64 bg-surface/95 dark:bg-surface-dark/95 backdrop-blur-sm border-r border-border dark:border-border-dark flex flex-col justify-between h-screen transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      <div>
        {/* Brand Logo */}
        <div className="p-6 flex items-center justify-between border-b border-border dark:border-border-dark">
          <NavLink to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-button bg-gradient-to-tr from-accent to-accent-light flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-accent/30">
              G
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight text-text-primary dark:text-text-dark">ShopGenie AI</h1>
              <p className="text-[10px] text-text-muted dark:text-text-mutedDark font-medium">Smart Retail Assistant</p>
            </div>
          </NavLink>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-210px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 rounded-button text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-accent to-accent-light text-white shadow-lg shadow-accent/25 font-semibold'
                      : 'text-text-muted dark:text-text-mutedDark hover:bg-background dark:hover:bg-background-dark hover:text-text-primary dark:hover:text-text-dark'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-gradient-to-r from-accent to-accent-light text-white shadow-sm">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Voice Assistant Floating Action Trigger */}
      <div className="p-4 border-t border-border dark:border-border-dark">
        <button
          onClick={() => setIsVoiceOpen(true)}
          className="w-full btn-primary py-3 px-4 rounded-button flex items-center justify-center gap-2.5 shadow-xl font-semibold text-sm group"
        >
          <Bot className="w-5 h-5 animate-pulse text-accent-300" />
          <span>Launch AI Voice</span>
        </button>
      </div>
      </aside>
    </>
  );
};

export default Sidebar;


