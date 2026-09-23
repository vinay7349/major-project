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
    <header className="h-20 bg-surface/95 dark:bg-surface-dark/95 backdrop-blur-sm border-b border-border dark:border-border-dark px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40 transition-colors">
      <button
        type="button"
        onClick={onToggleSidebar}
        aria-label={isSidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={isSidebarOpen}
        className="lg:hidden mr-3 shrink-0 p-2.5 rounded-button bg-background dark:bg-background-dark text-text-muted dark:text-text-mutedDark hover:text-text-primary dark:hover:text-text-dark transition-colors border border-border dark:border-border-dark"
      >
        {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
      {/* Search Input */}
      <form onSubmit={handleSearchSubmit} className="relative w-full max-w-96">
        <Search className="w-4 h-4 text-text-muted dark:text-text-mutedDark absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search products, orders, SKU, barcodes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 rounded-input bg-background dark:bg-background-dark border border-border dark:border-border-dark focus:border-accent text-xs text-text-primary dark:text-text-dark placeholder-text-text-muted dark:placeholder-text-text-mutedDark focus:outline-none transition-all"
        />
      </form>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Voice Assistant Trigger */}
        <button
          onClick={onOpenVoice}
          className="p-2.5 rounded-button bg-background dark:bg-background-dark hover:bg-background/80 dark:hover:bg-background-dark/80 text-accent border border-border dark:border-border-dark transition-all flex items-center gap-2 text-xs font-semibold"
        >
          <Mic className="w-4 h-4 text-accent animate-pulse" />
          <span className="hidden sm:inline">Voice Assistant</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-button bg-background dark:bg-background-dark text-text-muted dark:text-text-mutedDark hover:text-text-primary dark:hover:text-text-dark transition-all border border-border dark:border-border-dark"
          title="Toggle Dark/Light Mode"
        >
          {isDarkMode ? <Sun className="w-5 h-5 text-accent" /> : <Moon className="w-5 h-5 text-text-primary" />}
        </button>

        {/* Notification Icon */}
        <NavLink
          to="/notifications"
          className="relative p-2.5 rounded-button bg-background dark:bg-background-dark text-text-muted dark:text-text-mutedDark hover:text-text-primary dark:hover:text-text-dark transition-all border border-border dark:border-border-dark"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-error rounded-full animate-ping"></span>
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-error rounded-full"></span>
        </NavLink>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 p-1.5 rounded-button bg-background dark:bg-background-dark border border-border dark:border-border-dark hover:border-accent/50 transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-accent to-accent-light flex items-center justify-center text-white font-bold text-sm">
              {user?.username ? user.username[0].toUpperCase() : 'U'}
            </div>
            <div className="text-left hidden md:block pr-2">
              <p className="text-xs font-semibold text-text-primary dark:text-text-dark leading-tight">{user?.username || 'Guest User'}</p>
              <p className="text-[10px] text-text-muted dark:text-text-mutedDark">{user?.role || 'SHOP_OWNER'}</p>
            </div>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-3 w-56 card p-2 border border-border dark:border-border-dark shadow-modal z-50">
              <div className="p-3 border-b border-border dark:border-border-dark">
                <p className="text-xs font-bold text-text-primary dark:text-text-dark">{user?.shop_name || 'Genie Mart'}</p>
                <p className="text-[10px] text-text-muted dark:text-text-mutedDark">{user?.email || 'owner@shopgenie.ai'}</p>
              </div>
              <NavLink
                to="/profile"
                onClick={() => setShowDropdown(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-text-primary dark:text-text-dark hover:bg-background dark:hover:bg-background-dark rounded-button transition-colors"
              >
                <User className="w-4 h-4 text-accent" />
                <span>My Profile</span>
              </NavLink>
              <button
                onClick={() => {
                  setShowDropdown(false);
                  logout();
                  navigate('/customer/login');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-error hover:bg-error/10 rounded-button transition-colors"
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



