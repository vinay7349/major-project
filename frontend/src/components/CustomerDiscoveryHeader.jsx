import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Sparkles, Sun, Moon, User, LogOut, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const CustomerDiscoveryHeader = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const customerName = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username : 'Valued Customer';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-xl transition-colors">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <NavLink to="/customer" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 font-bold text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white">ShopGenie</span>
              <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-400 border border-cyan-500/20">
                Customer Hub
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Local Retail & Product Discovery</p>
          </div>
        </NavLink>

        {/* Center / Right Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Quick Profile Nav Link */}
          <NavLink
            to="/customer/profile"
            className="hidden sm:flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2 text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-all"
          >
            <User className="h-4 w-4 text-cyan-400" />
            <span>Profile</span>
            <ArrowRight className="h-3 w-3 text-slate-500" />
          </NavLink>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-slate-300 hover:bg-white/10 hover:text-white transition-all"
            title="Toggle Dark/Light Mode"
          >
            {isDarkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-400" />}
          </button>

          {/* User Profile Badge & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.06] p-1.5 pr-3 hover:border-cyan-500/40 hover:bg-white/10 transition-all text-left"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-600 font-bold text-white text-xs shadow-inner">
                {user?.first_name ? user.first_name[0].toUpperCase() : (user?.username?.[0]?.toUpperCase() || 'C')}
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-semibold text-white leading-tight">{customerName}</p>
                <p className="text-[10px] text-cyan-300/80 font-mono">Customer Account</p>
              </div>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-white/10 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-2xl z-50 animate-fade-down">
                <div className="border-b border-white/10 p-3">
                  <p className="text-xs font-bold text-white">{customerName}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user?.email || 'customer@shopgenie.ai'}</p>
                  <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-2 py-1 text-[10px] text-emerald-400 font-medium border border-emerald-500/20">
                    <ShieldCheck className="h-3 w-3" />
                    <span>Verified Customer Account</span>
                  </div>
                </div>

                <div className="py-1">
                  <NavLink
                    to="/customer/profile"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <User className="h-4 w-4 text-cyan-400" />
                    <span>Manage Customer Profile</span>
                  </NavLink>

                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      logout();
                      navigate('/login');
                    }}
                    className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default CustomerDiscoveryHeader;
