import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Search, Sun, Moon, Bell, User, LogOut, Mic, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = ({ onOpenVoice, onToggleSidebar, isSidebarOpen }) => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="h-20 bg-white/70 dark:bg-charcoal/70 backdrop-blur-xl border-b border-warmwhite/60 dark:border-charcoal/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40 transition-colors">
      <button
        type="button"
        onClick={onToggleSidebar}
        aria-label={isSidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={isSidebarOpen}
        className="lg:hidden mr-3 shrink-0 p-2.5 rounded-xl bg-warmwhite dark:bg-charcoal/60 text-slate dark:text-slate/60 hover:text-charcoal transition-colors border border-warmwhite/60 dark:border-charcoal/50"
      >
        {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
      {/* Search Input */}
      <form onSubmit={handleSearchSubmit} className="relative w-full max-w-96">
        <Search className="w-4 h-4 text-slate/80 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search products, orders, SKU, barcodes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-warmwhite dark:bg-charcoal/60 border border-transparent focus:border-charcoal/50 text-xs text-charcoal dark:text-slate/60 placeholder-slate-400 focus:outline-none transition-all"
        />
      </form>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Voice Assistant Trigger */}
        <button
          onClick={onOpenVoice}
          className="p-2.5 rounded-2xl bg-charcoal/10 hover:bg-charcoal/20 text-indigo-400 border border-charcoal/30 transition-all flex items-center gap-2 text-xs font-semibold"
        >
          <Mic className="w-4 h-4 text-indigo-400 animate-pulse" />
          <span className="hidden sm:inline">Voice Assistant</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-2xl bg-warmwhite dark:bg-charcoal/60 text-slate dark:text-slate/60 hover:text-navy dark:hover:text-white transition-all border border-warmwhite/60 dark:border-charcoal/50"
          title="Toggle Dark/Light Mode"
        >
          {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-charcoal" />}
        </button>

        {/* Notification Icon */}
        <NavLink
          to="/notifications"
          className="relative p-2.5 rounded-2xl bg-warmwhite dark:bg-charcoal/60 text-slate dark:text-slate/60 hover:text-charcoal transition-all border border-warmwhite/60 dark:border-charcoal/50"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red rounded-full animate-ping"></span>
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red rounded-full"></span>
        </NavLink>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 p-1.5 rounded-2xl bg-warmwhite dark:bg-charcoal/60 border border-warmwhite/60 dark:border-charcoal/50 hover:border-charcoal/50 transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
              {user?.username ? user.username[0].toUpperCase() : 'U'}
            </div>
            <div className="text-left hidden md:block pr-2">
              <p className="text-xs font-semibold text-charcoal dark:text-slate/60 leading-tight">{user?.username || 'Guest User'}</p>
              <p className="text-[10px] text-slate/80">{user?.role || 'SHOP_OWNER'}</p>
            </div>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-3 w-56 glass-card rounded-2xl p-2 border border-warmwhite/60 dark:border-charcoal shadow-2xl z-50">
              <div className="p-3 border-b border-warmwhite/60 dark:border-charcoal">
                <p className="text-xs font-bold text-charcoal dark:text-slate/60">{user?.shop_name || 'Genie Mart'}</p>
                <p className="text-[10px] text-slate/80">{user?.email || 'owner@shopgenie.ai'}</p>
              </div>
              <NavLink
                to="/profile"
                onClick={() => setShowDropdown(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-charcoal dark:text-slate/60 hover:bg-warmwhite dark:hover:bg-charcoal rounded-xl transition-colors"
              >
                <User className="w-4 h-4 text-indigo-400" />
                <span>My Profile</span>
              </NavLink>
              <button
                onClick={() => {
                  setShowDropdown(false);
                  logout();
                  navigate('/customer/login');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red hover:bg-red/10 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;



