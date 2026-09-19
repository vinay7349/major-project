import React, { useState } from 'react';
import { NavLink, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { 
  Sparkles, Sun, Moon, User, LogOut, ShieldCheck, 
  MapPin, Search, ShoppingBag, ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLocationContext } from '../context/LocationContext';

const CustomerDiscoveryHeader = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { areaName, radius } = useLocationContext();
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

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
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 bg-[#f8f5f1]/90 backdrop-blur-xl transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Main header row */}
        <div className="flex items-center justify-between gap-3 py-3 sm:py-3.5">

          {/* LEFT: Logo */}
          <NavLink to="/customer" className="flex items-center gap-3 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f59e0b] text-white shadow-sm shadow-amber-500/25 ring-4 ring-amber-500/10 transition-transform duration-200 hover:scale-105">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <div className="leading-none hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="text-[17px] font-bold tracking-[-0.03em] text-slate-900 dark:text-white">ShopGenie</span>
                <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-amber-700 dark:text-amber-300">
                  Local
                </span>
              </div>
              <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">Nearby discovery</p>
            </div>
          </NavLink>

          {/* CENTER: Search bar — desktop */}
          <div className="hidden flex-1 justify-center lg:flex mx-4">
            <div className="relative w-full max-w-xl">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchValue}
                onChange={handleSearchChange}
                placeholder="Search products, brands, stores..."
                className="h-11 w-full rounded-2xl border border-stone-200 bg-white/80 pl-11 pr-4 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* RIGHT: Controls — desktop */}
          <div className="hidden items-center gap-2 lg:flex shrink-0">

            {/* Location selector */}
            <div className="flex cursor-pointer items-center gap-2 rounded-xl border border-stone-200 bg-white/80 px-3 py-2 text-sm text-slate-700 hover:border-stone-300 hover:bg-white transition-colors dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:border-slate-600">
              <MapPin className="h-4 w-4 text-amber-500 dark:text-amber-400 shrink-0" />
              <span className="font-medium whitespace-nowrap">{areaName || 'Your Location'}</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">{radius} km</span>
            </div>

            {/* Explore + Profile nav pills */}
            <nav className="flex items-center gap-1 rounded-xl border border-stone-200 bg-white/80 p-1 dark:border-slate-700 dark:bg-slate-900/80">
              <NavLink
                to="/customer"
                end
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`
                }
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                Explore
              </NavLink>
              {user && (
                <NavLink
                  to="/customer/profile"
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-amber-500 text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                    }`
                  }
                >
                  <User className="h-3.5 w-3.5" />
                  Profile
                </NavLink>
              )}
            </nav>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 bg-white/80 text-slate-600 transition-colors hover:border-stone-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:text-white"
              title="Toggle theme"
            >
              {isDarkMode ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Account button / dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2.5 rounded-xl border border-stone-200 bg-white/80 px-2 py-1.5 text-left transition-colors hover:border-stone-300 dark:border-slate-700 dark:bg-slate-900/80"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-[11px] font-bold text-white">
                    {user.first_name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || 'C'}
                  </div>
                  <div className="pr-1">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">{customerName}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Customer account</p>
                  </div>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-stone-200 bg-white/95 p-2 shadow-xl backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/95 z-50">
                    <div className="border-b border-stone-100 p-3 dark:border-slate-800 mb-1">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{customerName}</p>
                      <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">{user.email}</p>
                      <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-medium text-emerald-700 dark:text-emerald-300">
                        <ShieldCheck className="h-3 w-3" /> Verified account
                      </div>
                    </div>
                    <NavLink
                      to="/customer/profile"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-slate-600 transition-colors hover:bg-stone-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                    >
                      <User className="h-4 w-4 text-amber-500" /> Manage profile
                    </NavLink>
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                    >
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white/80 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-amber-500/50 hover:text-amber-700 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:text-amber-400"
              >
                <User className="h-4 w-4" /> Sign in
              </button>
            )}
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 bg-white/80 dark:border-slate-700 dark:bg-slate-900/80"
            >
              {isDarkMode ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-slate-600 dark:text-slate-200" />}
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
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 bg-white/80 text-slate-700 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200"
                aria-label="Sign in"
              >
                <User className="h-4 w-4" />
              </button>
            )}
          </div>

        </div>

        {/* Mobile bottom row: Location + Search */}
        <div className="border-t border-stone-200/80 py-2.5 lg:hidden dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between gap-3 rounded-xl border border-stone-200 bg-white/80 px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-amber-500 dark:text-amber-400 shrink-0" />
              <span className="font-medium">{areaName || 'Your Location'}</span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">{radius} km</span>
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchValue}
              onChange={handleSearchChange}
              placeholder="Search products, brands, stores..."
              className="h-11 w-full rounded-xl border border-stone-200 bg-white/80 pl-11 pr-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Mobile dropdown */}
        {showDropdown && (
          <div className="lg:hidden border-t border-stone-200 dark:border-slate-800 py-2 space-y-0.5">
            {user ? (
              <>
                <div className="px-3 py-2 mb-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{customerName}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{user.email}</p>
                </div>
                <NavLink
                  to="/customer/profile"
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-slate-600 hover:bg-stone-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <User className="h-4 w-4 text-amber-500" /> Manage profile
                </NavLink>
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </>
            ) : (
              <button
                onClick={handleSignIn}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-stone-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <User className="h-4 w-4 text-amber-500" /> Sign in to your account
              </button>
            )}
          </div>
        )}

      </div>
    </header>
  );
};

export default CustomerDiscoveryHeader;
