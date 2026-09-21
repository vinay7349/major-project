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
    <header className="sticky top-0 z-40 w-full border-b border-warmwhite/60/80 bg-warmwhite/90 backdrop-blur-xl transition-colors duration-300 dark:border-charcoal dark:bg-navy/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Main header row */}
        <div className="flex items-center justify-between gap-3 py-3 sm:py-3.5">

          {/* LEFT: Logo */}
          <NavLink to="/customer" className="flex items-center gap-3 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber text-white shadow-sm shadow-amber/25 ring-4 ring-amber/10 transition-transform duration-200 hover:scale-105">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <div className="leading-none hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="text-[17px] font-bold tracking-[-0.03em] text-navy dark:text-white">ShopGenie</span>
                <span className="rounded-full border border-amber/20 bg-amber/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-amber dark:text-amber-300">
                  Local
                </span>
              </div>
              <p className="mt-0.5 text-[10px] text-slate dark:text-slate/80">Nearby discovery</p>
            </div>
          </NavLink>

          {/* CENTER: Search bar — desktop */}
          <div className="hidden flex-1 justify-center lg:flex mx-4">
            <div className="relative w-full max-w-xl">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate/80" />
              <input
                type="text"
                value={searchValue}
                onChange={handleSearchChange}
                placeholder="Search products, brands, stores..."
                className="h-11 w-full rounded-2xl border border-warmwhite/60 bg-white/80 pl-11 pr-4 text-sm text-charcoal outline-none transition-all placeholder:text-slate/80 focus:border-amber focus:ring-2 focus:ring-amber/20 dark:border-charcoal dark:bg-charcoal/80 dark:text-slate/60 dark:placeholder:text-slate"
              />
            </div>
          </div>

          {/* RIGHT: Controls — desktop */}
          <div className="hidden items-center gap-2 lg:flex shrink-0">

            {/* Location selector */}
            <div className="flex cursor-pointer items-center gap-2 rounded-xl border border-warmwhite/60 bg-white/80 px-3 py-2 text-sm text-charcoal hover:border-warmwhite/60 hover:bg-white transition-colors dark:border-charcoal dark:bg-charcoal/80 dark:text-slate/60 dark:hover:border-warmwhite/60">
              <MapPin className="h-4 w-4 text-amber dark:text-amber-400 shrink-0" />
              <span className="font-medium whitespace-nowrap">{areaName || 'Your Location'}</span>
              <span className="text-[11px] text-slate dark:text-slate/80">{radius} km</span>
            </div>

            {/* Explore + Profile nav pills */}
            <nav className="flex items-center gap-1 rounded-xl border border-warmwhite/60 bg-white/80 p-1 dark:border-charcoal dark:bg-charcoal/80">
              <NavLink
                to="/customer"
                end
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-amber text-white shadow-sm'
                      : 'text-slate hover:text-navy dark:text-slate/80 dark:hover:text-white'
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
                      `flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                        isActive
                          ? 'bg-amber text-white shadow-sm'
                          : 'text-slate hover:text-navy dark:text-slate/80 dark:hover:text-white'
                      }`
                    }
                  >
                    <Heart className="h-3.5 w-3.5" />
                    Saved
                    {savedCount > 0 && <span className="rounded-full bg-amber/20 px-1.5 py-0.5 text-[9px] font-extrabold text-amber dark:text-amber-200">{savedCount}</span>}
                  </NavLink>
                  <NavLink
                    to="/customer/cart"
                    className={({ isActive }) =>
                      `flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                        isActive
                          ? 'bg-amber text-white shadow-sm'
                          : 'text-slate hover:text-navy dark:text-slate/80 dark:hover:text-white'
                      }`
                    }
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    Cart
                    {cartCount > 0 && <span className="rounded-full bg-amber/20 px-1.5 py-0.5 text-[9px] font-extrabold text-amber dark:text-amber-200">{cartCount}</span>}
                  </NavLink>
                  <NavLink
                    to="/customer/profile"
                    className={({ isActive }) =>
                      `flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                        isActive
                          ? 'bg-amber text-white shadow-sm'
                          : 'text-slate hover:text-navy dark:text-slate/80 dark:hover:text-white'
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
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-warmwhite/60 bg-white/80 text-slate transition-colors hover:border-warmwhite/60 hover:text-navy dark:border-charcoal dark:bg-charcoal/80 dark:text-slate/60 dark:hover:text-white"
              title="Toggle theme"
            >
              {isDarkMode ? <Sun className="h-4 w-4 text-amber" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Account button / dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2.5 rounded-xl border border-warmwhite/60 bg-white/80 px-2 py-1.5 text-left transition-colors hover:border-warmwhite/60 dark:border-charcoal dark:bg-charcoal/80"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-[11px] font-bold text-white">
                    {user.first_name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || 'C'}
                  </div>
                  <div className="pr-1">
                    <p className="text-xs font-semibold text-charcoal dark:text-slate/60">{customerName}</p>
                    <p className="text-[10px] text-slate dark:text-slate/80">Customer account</p>
                  </div>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-warmwhite/60 bg-white/95 p-2 shadow-xl backdrop-blur-xl dark:border-charcoal dark:bg-charcoal/95 z-50">
                    <div className="border-b border-warmwhite/60 p-3 dark:border-charcoal mb-1">
                      <p className="text-xs font-bold text-navy dark:text-white">{customerName}</p>
                      <p className="mt-0.5 text-[11px] text-slate dark:text-slate/80">{user.email}</p>
                    </div>
                    <NavLink
                      to="/customer/profile"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-slate transition-colors hover:bg-warmwhite hover:text-navy dark:text-slate/60 dark:hover:bg-charcoal dark:hover:text-white"
                    >
                      <User className="h-4 w-4 text-amber" /> Manage profile
                    </NavLink>
                    <NavLink
                      to="/customer/saved"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-slate transition-colors hover:bg-warmwhite hover:text-navy dark:text-slate/60 dark:hover:bg-charcoal dark:hover:text-white"
                    >
                      <Heart className="h-4 w-4 text-amber" /> Saved items
                      {savedCount > 0 && <span className="ml-auto rounded-full bg-amber/10 px-2 py-0.5 text-[9px] font-extrabold text-amber dark:text-amber-300">{savedCount}</span>}
                    </NavLink>
                    <NavLink
                      to="/customer/cart"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-slate transition-colors hover:bg-warmwhite hover:text-navy dark:text-slate/60 dark:hover:bg-charcoal dark:hover:text-white"
                    >
                      <ShoppingCart className="h-4 w-4 text-amber" /> Cart
                      {cartCount > 0 && <span className="ml-auto rounded-full bg-amber/10 px-2 py-0.5 text-[9px] font-extrabold text-amber dark:text-amber-300">{cartCount}</span>}
                    </NavLink>
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs text-red transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-red/10"
                    >
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                className="flex items-center gap-2 rounded-xl border border-warmwhite/60 bg-white/80 px-3 py-2 text-xs font-semibold text-charcoal transition-colors hover:border-amber/50 hover:text-amber dark:border-charcoal dark:bg-charcoal/80 dark:text-slate/60 dark:hover:text-amber-400"
              >
                <User className="h-4 w-4" /> Sign in
              </button>
            )}
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-warmwhite/60 bg-white/80 dark:border-charcoal dark:bg-charcoal/80"
            >
              {isDarkMode ? <Sun className="h-4 w-4 text-amber" /> : <Moon className="h-4 w-4 text-slate dark:text-slate/60" />}
            </button>

            {user ? (
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-[11px] font-bold text-white shadow-sm"
              >
                {user.first_name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || 'C'}
              </button>
            ) : (
              <button
                onClick={handleSignIn}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-warmwhite/60 bg-white/80 text-charcoal dark:border-charcoal dark:bg-charcoal/80 dark:text-slate/60"
                aria-label="Sign in"
              >
                <User className="h-4 w-4" />
              </button>
            )}
          </div>

        </div>

        {/* Mobile bottom row: Location + Search */}
        <div className="border-t border-warmwhite/60/80 py-2.5 lg:hidden dark:border-charcoal space-y-2">
          <div className="flex items-center justify-between gap-3 rounded-xl border border-warmwhite/60 bg-white/80 px-3 py-2 text-sm text-charcoal dark:border-charcoal dark:bg-charcoal/80 dark:text-slate/60">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-amber dark:text-amber-400 shrink-0" />
              <span className="font-medium">{areaName || 'Your Location'}</span>
            </div>
            <span className="text-[11px] text-slate dark:text-slate/80">{radius} km</span>
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate/80" />
            <input
              type="text"
              value={searchValue}
              onChange={handleSearchChange}
              placeholder="Search products, brands, stores..."
              className="h-11 w-full rounded-xl border border-warmwhite/60 bg-white/80 pl-11 pr-4 text-sm text-charcoal outline-none placeholder:text-slate/80 focus:border-amber focus:ring-2 focus:ring-amber/20 dark:border-charcoal dark:bg-charcoal/80 dark:text-slate/60 dark:placeholder:text-slate"
            />
          </div>
        </div>

        {/* Mobile dropdown */}
        {showDropdown && (
          <div className="lg:hidden border-t border-warmwhite/60 dark:border-charcoal py-2 space-y-0.5">
            {user ? (
              <>
                <div className="px-3 py-2 mb-1">
                  <p className="text-xs font-bold text-navy dark:text-white">{customerName}</p>
                  <p className="text-[11px] text-slate dark:text-slate/80">{user.email}</p>
                </div>
                <NavLink
                  to="/customer/profile"
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-slate hover:bg-warmwhite dark:text-slate/60 dark:hover:bg-charcoal"
                >
                  <User className="h-4 w-4 text-amber" /> Manage profile
                </NavLink>
                <NavLink
                  to="/customer/saved"
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-slate hover:bg-warmwhite dark:text-slate/60 dark:hover:bg-charcoal"
                >
                  <Heart className="h-4 w-4 text-amber" /> Saved items
                  {savedCount > 0 && <span className="ml-auto rounded-full bg-amber/10 px-2 py-0.5 text-[9px] font-extrabold text-amber dark:text-amber-300">{savedCount}</span>}
                </NavLink>
                <NavLink
                  to="/customer/cart"
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-slate hover:bg-warmwhite dark:text-slate/60 dark:hover:bg-charcoal"
                >
                  <ShoppingCart className="h-4 w-4 text-amber" /> Cart
                  {cartCount > 0 && <span className="ml-auto rounded-full bg-amber/10 px-2 py-0.5 text-[9px] font-extrabold text-amber dark:text-amber-300">{cartCount}</span>}
                </NavLink>
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs text-red hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-red/10"
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </>
            ) : (
              <button
                onClick={handleSignIn}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-charcoal hover:bg-warmwhite dark:text-slate/60 dark:hover:bg-charcoal"
              >
                <User className="h-4 w-4 text-amber" /> Sign in to your account
              </button>
            )}
          </div>
        )}

      </div>
    </header>
  );
};

export default CustomerDiscoveryHeader;



