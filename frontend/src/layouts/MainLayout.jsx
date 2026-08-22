import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Sun, Moon, LogIn, ShoppingBag, Store } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const MainLayout = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${isHome ? 'bg-sky-50 text-slate-900' : 'bg-slate-950 text-slate-100'}`}>
      {/* Top Header */}
      <header className={`h-20 border-b px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-40 backdrop-blur-xl ${isHome ? 'border-sky-100 bg-white/85' : 'border-slate-800/80 bg-slate-950/70'}`}>
        <NavLink to="/" className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-bold text-2xl">
            G
          </div>
          <div>
            <h1 className="font-normal text-base tracking-tight text-black">ShopGenie</h1>
            <p className="text-[10px] text-slate-400 font-medium">Smart Retail Assistant</p>
          </div>
        </NavLink>

        <nav className={`hidden lg:flex items-center gap-8 text-sm font-medium ${isHome ? 'text-slate-600' : 'text-slate-300'}`}>
          <NavLink to="/" className={({ isActive }) => isActive ? 'text-sky-600 font-semibold' : 'hover:text-slate-900 transition-colors'}>Home</NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'text-sky-600 font-semibold' : 'hover:text-white transition-colors'}>About</NavLink>
          <NavLink to="/features" className={({ isActive }) => isActive ? 'text-sky-600 font-semibold' : 'hover:text-white transition-colors'}>Features</NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={`p-2.5 rounded-2xl border transition-all shrink-0 ${isHome ? 'bg-white border-sky-200 text-slate-600 hover:text-sky-700' : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'}`}
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-400" />}
          </button>
          <NavLink
            to="/login?role=customer"
            title="Sign in"
            aria-label="Sign in"
            className={`px-3 sm:px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${isHome ? 'border-sky-200 text-slate-700 bg-white hover:bg-sky-50' : 'border-white text-white bg-slate-900/40 hover:bg-slate-800'}`}
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </NavLink>
          <NavLink to="/register?role=customer" className={`hidden sm:flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${isHome ? 'border-sky-200 text-slate-700 hover:border-cyan-400 hover:text-slate-900' : 'border-slate-700 text-slate-200 hover:border-cyan-400 hover:text-white'}`}>
            <ShoppingBag className="w-4 h-4 text-cyan-400" />
            <span>For shoppers</span>
          </NavLink>
          <NavLink to="/register?role=owner" className="px-3 sm:px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all whitespace-nowrap">
            <Store className="w-4 h-4" />
            <span>For shop owners</span>
          </NavLink>
        </div>
      </header>

      {/* Main Page Body */}
      <main className="flex-1">
        <Outlet />
      </main>

    </div>
  );
};

export default MainLayout;
