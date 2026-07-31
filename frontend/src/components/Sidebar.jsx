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

const Sidebar = ({ isVoiceOpen, setIsVoiceOpen }) => {
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
    { label: 'Admin Panel', path: '/admin-panel', icon: ShieldCheck },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800/80 flex flex-col justify-between h-screen sticky top-0 z-30 transition-all duration-300">
      <div>
        {/* Brand Logo */}
        <div className="p-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-800/60">
          <NavLink to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-indigo-500/30">
              G
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight gradient-text">ShopGenie AI</h1>
              <p className="text-[10px] text-slate-400 font-medium">Smart Retail Assistant</p>
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
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 text-white shadow-sm">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Voice Assistant Floating Action Trigger */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800/60">
        <button
          onClick={() => setIsVoiceOpen(true)}
          className="w-full gradient-btn-primary py-3 px-4 rounded-2xl flex items-center justify-center gap-2.5 shadow-xl font-semibold text-sm group"
        >
          <Bot className="w-5 h-5 animate-pulse text-cyan-300" />
          <span>Launch AI Voice</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
