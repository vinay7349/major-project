import React, { useState } from 'react';
import { NavLink, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { 
  Sparkles, Sun, Moon, User, LogOut, Heart, ShoppingCart,
  MapPin, Search, ShoppingBag, ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLocationContext } from '../context/LocationContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const CustomerDiscoveryHeader = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { areaName, radius } = useLocationContext();
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems } = useCart();
  const { savedItems, savedShops } = useWishlist();
  const cartCount = cartItems.reduce((total, item) => total + (Number(item.quantity) || 1), 0);
  const savedCount = savedItems.length + savedShops.length;

  const customerName = user
    ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username
    : 'Guest';

  const searchValue = searchParams.get('q') || '';

  const handleSearchChange = (e) => {
    const val = e.target.value;
    if (val) {
      setSearchParams({ q: val });
    } else {
      setSearchParams({});
    }
  };

  const handleSignIn = () => {
    setShowDropdown(false);
    navigate('/customer/login', { state: { from: location.pathname } });
  };

  const handleSignOut = () => {
    setShowDropdown(false);
    logout();
    navigate('/customer/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border dark:border-border-dark bg-surface/95 dark:bg-surface-dark/95 backdrop-blur-sm transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Main header row */}
        <div className="flex items-center justify-between gap-3 py-3 sm:py-3.5">

          {/* LEFT: Logo */}
          <NavLink to="/customer" className="flex items-center gap-3 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-button bg-accent text-white shadow-sm shadow-accent/25 ring-4 ring-accent/10 transition-transform duration-200 hover:scale-105">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <div className="leading-none hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="text-[17px] font-bold tracking-[-0.03em] text-text-primary dark:text-text-dark">ShopGenie</span>
                <span className="rounded-full border border-accent/20 bg-accent/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-accent dark:text-accent-300">
                  Local
                </span>
              </div>
              <p className="mt-0.5 text-[10px] text-text-muted dark:text-text-mutedDark">Nearby discovery</p>
            </div>
          </NavLink>

          {/* CENTER: Search bar — desktop */}
          <div className="hidden flex-1 justify-center lg:flex mx-4">
            <div className="relative w-full max-w-xl">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted dark:text-text-mutedDark" />
              <input
                type="text"
                value={searchValue}
                onChange={handleSearchChange}
                placeholder="Search products, brands, stores..."
                className="h-11 w-full rounded-input border border-border dark:border-border-dark bg-background dark:bg-background-dark pl-11 pr-4 text-sm text-text-primary dark:text-text-dark outline-none transition-all placeholder:text-text-muted dark:placeholder:text-text-mutedDark focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>
          </div>

          {/* RIGHT: Controls — desktop */}
          <div className="hidden items-center gap-2 lg:flex shrink-0">

            {/* Location selector */}
            <div className="flex cursor-pointer items-center gap-2 rounded-button border border-border dark:border-border-dark bg-background dark:bg-background-dark px-3 py-2 text-sm text-text-primary dark:text-text-dark hover:border-accent/50 hover:bg-background/80 dark:hover:bg-background-dark/80 transition-colors">
              <MapPin className="h-4 w-4 text-accent dark:text-accent-400 shrink-0" />
              <span className="font-medium whitespace-nowrap">{areaName || 'Your Location'}</span>
              <span className="text-[11px] text-text-muted dark:text-text-mutedDark">{radius} km</span>
            </div>

            {/* Explore + Profile nav pills */}
            <nav className="flex items-center gap-1 rounded-button border border-border dark:border-border-dark bg-background dark:bg-background-dark p-1">
              <NavLink
                to="/customer"
                end
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-button px-3 py-1.5 text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-accent text-white shadow-sm'
                      : 'text-text-muted hover:text-text-primary dark:text-text-mutedDark dark:hover:text-text-dark'
                  }`
                }
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                Explore
              </NavLink>
              {user && (
                <>
                  <NavLink
                    to="/customer/saved"
                    className={({ isActive }) =>
                      `flex items-center gap-1.5 rounded-button px-3 py-1.5 text-xs font-semibold transition-colors ${
                        isActive
                          ? 'bg-accent text-white shadow-sm'
                          : 'text-text-muted hover:text-text-primary dark:text-text-mutedDark dark:hover:text-text-dark'
                      }`
                    }
                  >
                    <Heart className="h-3.5 w-3.5" />
                    Saved
                    {savedCount > 0 && <span className="rounded-full bg-accent/20 px-1.5 py-0.5 text-[9px] font-extrabold text-accent dark:text-accent-200">{savedCount}</span>}
                  </NavLink>
                  <NavLink
                    to="/customer/cart"
                    className={({ isActive }) =>
                      `flex items-center gap-1.5 rounded-button px-3 py-1.5 text-xs font-semibold transition-colors ${
                        isActive
                          ? 'bg-accent text-white shadow-sm'
                          : 'text-text-muted hover:text-text-primary dark:text-text-mutedDark dark:hover:text-text-dark'
                      }`
                    }
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    Cart
                    {cartCount > 0 && <span className="rounded-full bg-accent/20 px-1.5 py-0.5 text-[9px] font-extrabold text-accent dark:text-accent-200">{cartCount}</span>}
                  </NavLink>
                  <NavLink
                    to="/customer/profile"
                    className={({ isActive }) =>
                      `flex items-center gap-1.5 rounded-button px-3 py-1.5 text-xs font-semibold transition-colors ${
                        isActive
                          ? 'bg-accent text-white shadow-sm'
                          : 'text-text-muted hover:text-text-primary dark:text-text-mutedDark dark:hover:text-text-dark'
                      }`
                    }
                  >
                    <User className="h-3.5 w-3.5" />
                    Profile
                  </NavLink>
                </>
              )}
            </nav>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-button border border-border dark:border-border-dark bg-background dark:bg-background-dark text-text-muted transition-colors hover:border-accent/50 hover:text-text-primary dark:hover:text-text-dark"
              title="Toggle theme"
            >
              {isDarkMode ? <Sun className="h-4 w-4 text-accent" /> : <Moon className="h-4 w-4 text-text-primary" />}
            </button>

            {/* Account button / dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2.5 rounded-button border border-border dark:border-border-dark bg-background dark:bg-background-dark px-2 py-1.5 text-left transition-colors hover:border-accent/50"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-button bg-gradient-to-br from-accent to-accent-light text-[11px] font-bold text-white">
                    {user.first_name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || 'C'}
                  </div>
                  <div className="pr-1">
                    <p className="text-xs font-semibold text-text-primary dark:text-text-dark">{customerName}</p>
                    <p className="text-[10px] text-text-muted dark:text-text-mutedDark">Customer account</p>
                  </div>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-60 card p-2 shadow-modal z-50">
                    <div className="border-b border-border dark:border-border-dark p-3 mb-1">
                      <p className="text-xs font-bold text-text-primary dark:text-text-dark">{customerName}</p>
                      <p className="mt-0.5 text-[11px] text-text-muted dark:text-text-mutedDark">{user.email}</p>
                    </div>
                    <NavLink
                      to="/customer/profile"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2.5 rounded-button px-3 py-2 text-xs text-text-muted transition-colors hover:bg-background dark:hover:bg-background-dark hover:text-text-primary dark:hover:text-text-dark"
                    >
                      <User className="h-4 w-4 text-accent" /> Manage profile
                    </NavLink>
                    <NavLink
                      to="/customer/saved"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2.5 rounded-button px-3 py-2 text-xs text-text-muted transition-colors hover:bg-background dark:hover:bg-background-dark hover:text-text-primary dark:hover:text-text-dark"
                    >
                      <Heart className="h-4 w-4 text-accent" /> Saved items
                      {savedCount > 0 && <span className="ml-auto rounded-full bg-accent/10 px-2 py-0.5 text-[9px] font-extrabold text-accent dark:text-accent-300">{savedCount}</span>}
                    </NavLink>
                    <NavLink
                      to="/customer/cart"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2.5 rounded-button px-3 py-2 text-xs text-text-muted transition-colors hover:bg-background dark:hover:bg-background-dark hover:text-text-primary dark:hover:text-text-dark"
                    >
                      <ShoppingCart className="h-4 w-4 text-accent" /> Cart
                      {cartCount > 0 && <span className="ml-auto rounded-full bg-accent/10 px-2 py-0.5 text-[9px] font-extrabold text-accent dark:text-accent-300">{cartCount}</span>}
                    </NavLink>
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2.5 rounded-button px-3 py-2 text-left text-xs text-error transition-colors hover:bg-error/10 dark:hover:bg-error/10"
                    >
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                className="flex items-center gap-2 rounded-button border border-border dark:border-border-dark bg-background dark:bg-background-dark px-3 py-2 text-xs font-semibold text-text-primary dark:text-text-dark transition-colors hover:border-accent/50 hover:text-accent"
              >
                <User className="h-4 w-4" /> Sign in
              </button>
            )}
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-button border border-border dark:border-border-dark bg-background dark:bg-background-dark"
            >
              {isDarkMode ? <Sun className="h-4 w-4 text-accent" /> : <Moon className="h-4 w-4 text-text-muted dark:text-text-mutedDark" />}
            </button>

            {user ? (
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex h-9 w-9 items-center justify-center rounded-button bg-gradient-to-br from-accent to-accent-light text-[11px] font-bold text-white shadow-sm"
              >
                {user.first_name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || 'C'}
              </button>
            ) : (
              <button
                onClick={handleSignIn}
                className="flex h-9 w-9 items-center justify-center rounded-button border border-border dark:border-border-dark bg-background dark:bg-background-dark text-text-primary dark:text-text-dark"
                aria-label="Sign in"
              >
                <User className="h-4 w-4" />
              </button>
            )}
          </div>

        </div>

        {/* Mobile bottom row: Location + Search */}
        <div className="border-t border-border dark:border-border-dark py-2.5 lg:hidden space-y-2">
          <div className="flex items-center justify-between gap-3 rounded-button border border-border dark:border-border-dark bg-background dark:bg-background-dark px-3 py-2 text-sm text-text-primary dark:text-text-dark">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-accent dark:text-accent-400 shrink-0" />
              <span className="font-medium">{areaName || 'Your Location'}</span>
            </div>
            <span className="text-[11px] text-text-muted dark:text-text-mutedDark">{radius} km</span>
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted dark:text-text-mutedDark" />
            <input
              type="text"
              value={searchValue}
              onChange={handleSearchChange}
              placeholder="Search products, brands, stores..."
              className="h-11 w-full rounded-input border border-border dark:border-border-dark bg-background dark:bg-background-dark pl-11 pr-4 text-sm text-text-primary dark:text-text-dark outline-none placeholder:text-text-muted dark:placeholder:text-text-mutedDark focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </div>
        </div>

        {/* Mobile dropdown */}
        {showDropdown && (
          <div className="lg:hidden border-t border-border dark:border-border-dark py-2 space-y-0.5">
            {user ? (
              <>
                <div className="px-3 py-2 mb-1">
                  <p className="text-xs font-bold text-text-primary dark:text-text-dark">{customerName}</p>
                  <p className="text-[11px] text-text-muted dark:text-text-mutedDark">{user.email}</p>
                </div>
                <NavLink
                  to="/customer/profile"
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-2.5 rounded-button px-3 py-2 text-xs text-text-muted hover:bg-background dark:hover:bg-background-dark dark:text-text-mutedDark"
                >
                  <User className="h-4 w-4 text-accent" /> Manage profile
                </NavLink>
                <NavLink
                  to="/customer/saved"
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-2.5 rounded-button px-3 py-2 text-xs text-text-muted hover:bg-background dark:hover:bg-background-dark dark:text-text-mutedDark"
                >
                  <Heart className="h-4 w-4 text-accent" /> Saved items
                  {savedCount > 0 && <span className="ml-auto rounded-full bg-accent/10 px-2 py-0.5 text-[9px] font-extrabold text-accent dark:text-accent-300">{savedCount}</span>}
                </NavLink>
                <NavLink
                  to="/customer/cart"
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-2.5 rounded-button px-3 py-2 text-xs text-text-muted hover:bg-background dark:hover:bg-background-dark dark:text-text-mutedDark"
                >
                  <ShoppingCart className="h-4 w-4 text-accent" /> Cart
                  {cartCount > 0 && <span className="ml-auto rounded-full bg-accent/10 px-2 py-0.5 text-[9px] font-extrabold text-accent dark:text-accent-300">{cartCount}</span>}
                </NavLink>
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2.5 rounded-button px-3 py-2 text-left text-xs text-error hover:bg-error/10 dark:hover:bg-error/10"
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </>
            ) : (
              <button
                onClick={handleSignIn}
                className="flex w-full items-center gap-2.5 rounded-button px-3 py-2 text-left text-xs font-semibold text-text-primary dark:text-text-dark hover:bg-background dark:hover:bg-background-dark"
              >
                <User className="h-4 w-4 text-accent" /> Sign in to your account
              </button>
            )}
          </div>
        )}

      </div>
    </header>
  );
};

export default CustomerDiscoveryHeader;



