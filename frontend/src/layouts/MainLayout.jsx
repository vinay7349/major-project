import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Sun, Moon, LogIn, Store, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const links = [{ to: '/', label: 'Home' }, { to: '/about', label: 'About' }, { to: '/features', label: 'Features' }];

const MainLayout = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isHome = pathname === '/';

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = '' };
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLink = ({ isActive }) => `text-text-muted dark:text-text-mutedDark text-small font-medium hover:text-accent transition-colors ${isActive ? 'text-accent' : ''}`;

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors bg-background dark:bg-background-dark text-text-primary dark:text-text-dark">
      <header className={`w-full sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-surface dark:bg-surface-dark shadow-header' : 'bg-surface/95 dark:bg-surface-dark/95 backdrop-blur-sm'}`}>
        <div className="w-full max-w-[1200px] mx-auto px-6 h-[60px] md:h-[60px] flex items-center justify-between gap-4">
          <NavLink to="/" className="flex items-center gap-2.5 shrink-0" onClick={() => setIsOpen(false)}>
            <div className="w-8 h-8 rounded-lg bg-accent text-white flex items-center justify-center font-bold text-lg">G</div>
            <div>
              <h1 className="text-text-primary dark:text-text-dark text-lg font-bold leading-none tracking-tight">ShopGenie AI</h1>
              <p className="text-[10px] text-text-muted dark:text-text-mutedDark font-medium mt-0.5">Smart Retail Assistant</p>
            </div>
          </NavLink>
          <nav className="hidden lg:flex h-full items-center gap-8">
            {links.map(({ to, label }) => <NavLink key={to} to={to} className={navLink}>{label}</NavLink>)}
          </nav>
          <div className="hidden lg:flex h-full items-center gap-3">
            <button onClick={toggleTheme} aria-label="Toggle theme" className="w-10 h-10 rounded-button flex items-center justify-center text-text-muted dark:text-text-mutedDark hover:bg-background dark:hover:bg-background-dark transition-colors">
              {isDarkMode ? <Sun className="w-5 h-5 text-accent" /> : <Moon className="w-5 h-5" />}
            </button>
            <NavLink to="/customer/login" className="h-10 px-5 rounded-button text-text-primary dark:text-text-dark text-small font-medium flex items-center gap-2 hover:bg-background dark:hover:bg-background-dark transition-colors">
              <LogIn className="w-4 h-4" />User Login
            </NavLink>
            <NavLink to="/shop-owner/login" className="h-10 px-5 btn-primary text-white text-small font-medium flex items-center gap-2">
              <Store className="w-4 h-4" />For shop owners
            </NavLink>
          </div>
          <button className="lg:hidden w-10 h-10 flex items-center justify-center rounded-button text-text-primary dark:text-text-dark hover:bg-background dark:hover:bg-background-dark transition-colors" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>
      
      {/* Mobile Navigation Overlay */}
      <div className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ${isOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-overlay transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsOpen(false)} />
        <div className={`absolute inset-x-0 top-[60px] bottom-0 bg-surface dark:bg-surface-dark p-6 transition-all duration-300 ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}>
          <div className="flex flex-col gap-2">
            {links.map(({ to, label }, i) => (
              <NavLink 
                key={to} 
                to={to} 
                onClick={() => setIsOpen(false)}
                className="px-4 py-4 rounded-card text-text-primary dark:text-text-dark text-body font-medium hover:bg-background dark:hover:bg-background-dark transition-colors"
                style={{ transitionDelay: isOpen ? `${i * 50}ms` : '0ms' }}
              >
                {label}
              </NavLink>
            ))}
          </div>
          <div className="h-px bg-border dark:bg-border-dark my-6" />
          <div className="flex flex-col gap-3">
            <NavLink to="/shop-owner/login" onClick={() => setIsOpen(false)} className="w-full h-12 btn-primary text-white text-small font-medium flex items-center justify-center gap-2">
              <Store className="w-4 h-4" />For shop owners
            </NavLink>
            <NavLink to="/customer/login" onClick={() => setIsOpen(false)} className="w-full h-12 btn-outline text-accent text-small font-medium flex items-center justify-center gap-2">
              <LogIn className="w-4 h-4" />User Login
            </NavLink>
          </div>
        </div>
      </div>
      
      <main className="flex-1"><Outlet /></main>
      
      {/* Footer */}
      <footer className="w-full bg-surface dark:bg-surface-dark border-t border-border dark:border-border-dark">
        <div className="w-full max-w-[1200px] mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand Info */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-accent text-white flex items-center justify-center font-bold text-lg">G</div>
                <h3 className="text-text-primary dark:text-text-dark text-lg font-bold">ShopGenie AI</h3>
              </div>
              <p className="text-text-muted dark:text-text-mutedDark text-body mb-4">Smart Retail Assistant for modern businesses.</p>
              <div className="flex gap-4">
                <a href="#" className="text-text-muted dark:text-text-mutedDark hover:text-accent transition-colors" aria-label="Twitter"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/></svg></a>
                <a href="#" className="text-text-muted dark:text-text-mutedDark hover:text-accent transition-colors" aria-label="LinkedIn"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></a>
                <a href="#" className="text-text-muted dark:text-text-mutedDark hover:text-accent transition-colors" aria-label="Instagram"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="text-text-primary dark:text-text-dark font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><NavLink to="/about" className="text-text-muted dark:text-text-mutedDark hover:text-accent transition-colors">About</NavLink></li>
                <li><NavLink to="/features" className="text-text-muted dark:text-text-mutedDark hover:text-accent transition-colors">Features</NavLink></li>
                <li><NavLink to="/customer/login" className="text-text-muted dark:text-text-mutedDark hover:text-accent transition-colors">Customer Login</NavLink></li>
                <li><NavLink to="/shop-owner/login" className="text-text-muted dark:text-text-mutedDark hover:text-accent transition-colors">Shop Owner Login</NavLink></li>
              </ul>
            </div>
            
            {/* Legal */}
            <div>
              <h4 className="text-text-primary dark:text-text-dark font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-text-muted dark:text-text-mutedDark hover:text-accent transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-text-muted dark:text-text-mutedDark hover:text-accent transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-text-muted dark:text-text-mutedDark hover:text-accent transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border dark:border-border-dark text-center">
            <p className="text-text-muted dark:text-text-mutedDark text-small">© 2024 ShopGenie AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;


