import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Sparkles, Sun, Moon, LogIn, UserPlus } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const MainLayout = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans transition-colors">
      {/* Top Header */}
      <header className="h-20 border-b border-slate-800/80 px-8 flex items-center justify-between sticky top-0 z-40 backdrop-blur-xl bg-slate-950/70">
        <NavLink to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-indigo-500/30">
            G
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight gradient-text">ShopGenie AI</h1>
            <p className="text-[10px] text-slate-400 font-medium">Smart Retail Assistant</p>
          </div>
        </NavLink>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <NavLink to="/" className={({ isActive }) => isActive ? 'text-indigo-400 font-semibold' : 'hover:text-white transition-colors'}>Home</NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'text-indigo-400 font-semibold' : 'hover:text-white transition-colors'}>About</NavLink>
          <NavLink to="/features" className={({ isActive }) => isActive ? 'text-indigo-400 font-semibold' : 'hover:text-white transition-colors'}>Features</NavLink>
          <NavLink to="/dashboard" className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 font-semibold">
            <Sparkles className="w-4 h-4" /> Live Demo
          </NavLink>
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-all"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-400" />}
          </button>
          <NavLink to="/login" className="px-5 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 text-sm font-semibold flex items-center gap-2 transition-all">
            <LogIn className="w-4 h-4" /> Login
          </NavLink>
          <NavLink to="/register" className="gradient-btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
            <UserPlus className="w-4 h-4" /> Get Started
          </NavLink>
        </div>
      </header>

      {/* Main Page Body */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-12 px-8 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">G</div>
            <span className="font-bold text-slate-300">ShopGenie AI Assistant</span>
          </div>
          <p>© 2026 ShopGenie AI Inc. All rights reserved. Empowering modern retail stores worldwide.</p>
          <div className="flex gap-6 text-slate-400">
            <NavLink to="/about" className="hover:text-indigo-400">Privacy Policy</NavLink>
            <NavLink to="/features" className="hover:text-indigo-400">Terms of Service</NavLink>
            <NavLink to="/nearby-shops" className="hover:text-indigo-400">Retail Network</NavLink>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
