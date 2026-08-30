import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Sparkles, Sun, Moon, User, LogOut, ShieldCheck, MapPin, Search, ShoppingBag, SlidersHorizontal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const CustomerDiscoveryHeader = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const customerName = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username : 'Valued Customer';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 bg-[#f8f5f1]/90 backdrop-blur-xl transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 py-3 sm:py-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <NavLink to="/customer" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f59e0b] text-white shadow-sm shadow-amber-500/25 ring-4 ring-amber-500/10 transition-transform duration-200 hover:scale-105">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="leading-none">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold tracking-[-0.03em] text-slate-900 dark:text-white">ShopGenie</span>
                  <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-amber-700 dark:text-amber-300">
                    Local
                  </span>
                </div>
                <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">Nearby discovery</p>
              </div>
            </NavLink>
          </div>

          <div className="hidden flex-1 justify-center lg:flex">
            <div className="relative w-full max-w-xl">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search products, brands, stores"
                className="h-12 w-full rounded-2xl border border-stone-200 bg-white/80 pl-11 pr-4 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-amber-500 focus:ring-3 focus:ring-amber-500/20 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:placeholder:text-slate-500"
                readOnly
              />
            </div>
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <div className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-white/80 px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200">
              <MapPin className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span className="font-medium">Downtown Sector 4</span>
            </div>

            <nav className="flex items-center gap-1 rounded-2xl border border-stone-200 bg-white/80 p-1 dark:border-slate-700 dark:bg-slate-900/80">
              <NavLink
                to="/customer"
                end
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                    isActive ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`
                }
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                Explore
              </NavLink>
              <NavLink
                to="/customer/profile"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                    isActive ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`
                }
              >
                <User className="h-3.5 w-3.5" />
                Profile
              </NavLink>
            </nav>

            <button
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-stone-200 bg-white/80 text-slate-600 transition-colors hover:border-stone-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:text-white"
              title="Toggle Dark/Light Mode"
            >
              {isDarkMode ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-slate-700 dark:text-slate-200" />}
            </button>

            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2.5 rounded-2xl border border-stone-200 bg-white/80 px-2 py-1.5 text-left transition-colors hover:border-stone-300 dark:border-slate-700 dark:bg-slate-900/80"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 font-semibold text-white">
                  {user?.first_name ? user.first_name[0].toUpperCase() : (user?.username?.[0]?.toUpperCase() || 'C')}
                </div>
                <div className="pr-1">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">{customerName}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">{user ? 'Customer account' : 'Guest shopper'}</p>
                </div>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-stone-200 bg-white/95 p-2 shadow-xl shadow-stone-200/50 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/95 dark:shadow-none z-50">
                  <div className="border-b border-stone-200 p-3 dark:border-slate-700">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{customerName}</p>
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{user?.email || 'Guest Explorer Mode'}</p>
                    <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-medium text-emerald-700 dark:text-emerald-300">
                      <ShieldCheck className="h-3 w-3" />
                      {user ? 'Verified account' : 'Browsing nearby stores'}
                    </div>
                  </div>

                  <div className="py-1">
                    {user && (
                      <NavLink
                        to="/customer/profile"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-slate-600 transition-colors hover:bg-stone-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                      >
                        <User className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        Manage profile
                      </NavLink>
                    )}

                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        if (user) logout();
                        navigate('/customer/login');
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs text-rose-600 transition-colors hover:bg-rose-500/10 dark:text-rose-400"
                    >
                      <LogOut className="h-4 w-4" />
                      {user ? 'Sign out' : 'Sign in'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-stone-200 bg-white/80 text-slate-600 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200"
            >
              {isDarkMode ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-slate-700 dark:text-slate-200" />}
            </button>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-stone-200 bg-white/80 text-slate-700 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200"
              aria-label="Open profile menu"
            >
              <User className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="border-t border-stone-200/80 pb-3 pt-3 lg:hidden dark:border-slate-800">
          <div className="mb-3 flex items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white/80 px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span className="font-medium">Downtown Sector 4</span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">2.5 km</span>
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search products, brands, stores"
              className="h-12 w-full rounded-2xl border border-stone-200 bg-white/80 pl-11 pr-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-amber-500 focus:ring-3 focus:ring-amber-500/20 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:placeholder:text-slate-500"
              readOnly
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default CustomerDiscoveryHeader;
