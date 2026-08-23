import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Sun, Moon, LogIn, Store, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const links = [{ to: '/', label: 'Home' }, { to: '/about', label: 'About' }, { to: '/features', label: 'Features' }];

const MainLayout = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const isHome = pathname === '/';

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const navLink = ({ isActive }) => `text-white/80 text-[14px] font-[450] leading-[14px] hover:text-white transition-colors ${isActive ? 'text-white' : ''}`;

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${isHome ? 'bg-[#080A19] text-white' : 'bg-slate-950 text-slate-100'}`}>
      <header className={`w-full ${isHome ? 'absolute top-0 z-50' : 'sticky top-0 z-40 bg-slate-950/70 border-b border-slate-800/80 backdrop-blur-xl'}`}>
        <div className={`w-full max-w-[1800px] mx-auto px-5 sm:px-8 md:px-[82px] ${isHome ? 'pt-[20px] sm:pt-[30px]' : 'h-20'} flex items-center justify-between gap-4`}>
          <NavLink to="/" className="flex items-center gap-2.5 shrink-0" onClick={() => setIsOpen(false)}><div className="w-7 h-7 sm:w-8 sm:h-8 rounded-[9px] bg-white text-[#080A19] flex items-center justify-center font-[450] text-lg">G</div><div><h1 className="text-white text-[22px] sm:text-[26px] font-[450] leading-none tracking-[-0.02em]">ShopGenie AI</h1><p className="text-[10px] text-white/55 font-medium mt-1">Smart Retail Assistant</p></div></NavLink>
          <nav className="hidden lg:flex h-[52px] px-6 items-center gap-[30px] bg-[rgba(10,7,7,0.35)] rounded-[11px] backdrop-blur-[17px]">{links.map(({ to, label }) => <NavLink key={to} to={to} className={navLink}>{label}</NavLink>)}</nav>
          <div className="hidden lg:flex h-[52px] p-[3px] bg-[rgba(0,0,0,0.35)] rounded-[13px] backdrop-blur-[17px] items-center gap-[5px]">
            <button onClick={toggleTheme} aria-label="Toggle theme" className="w-[46px] h-[46px] rounded-[11px] text-white/80 hover:bg-white/5 transition-colors">{isDarkMode ? <Sun className="w-4 h-4 mx-auto text-amber-300" /> : <Moon className="w-4 h-4 mx-auto" />}</button>
            <NavLink to="/login?role=customer" className="h-[46px] px-5 rounded-[11px] text-white text-[14px] font-[450] flex items-center gap-2 hover:bg-white/5 transition-colors"><LogIn className="w-4 h-4" />User Login</NavLink>
            <NavLink to="/register?role=owner" className="h-[46px] px-5 bg-[#E9E9E9] rounded-[11px] text-[#0A0707] text-[14px] font-[450] flex items-center gap-2 hover:bg-white transition-colors"><Store className="w-4 h-4" />For shop owners</NavLink>
          </div>
          <button className="lg:hidden w-[44px] h-[44px] flex items-center justify-center rounded-[11px] bg-[rgba(10,7,7,0.35)] backdrop-blur-[17px] transition-colors hover:bg-white/10" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu"><span className="relative w-5 h-5"><Menu className={`w-5 h-5 text-white absolute inset-0 transition-all duration-300 ease-out ${isOpen ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'}`} /><X className={`w-5 h-5 text-white absolute inset-0 transition-all duration-300 ease-out ${isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'}`} /></span></button>
        </div>
      </header>
      <div className={`lg:hidden fixed inset-0 z-40 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isOpen ? 'visible' : 'invisible'}`}><div className={`absolute inset-0 bg-[#080A19]/90 backdrop-blur-[24px] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsOpen(false)} /><div className={`absolute top-[76px] sm:top-[86px] left-4 right-4 sm:left-6 sm:right-6 bg-[rgba(17,16,15,0.6)] backdrop-blur-[30px] rounded-[20px] border border-white/[0.06] p-6 sm:p-8 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] origin-top ${isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-[0.97]'}`}><div className="flex flex-col gap-1">{links.map(({ to, label }, i) => <NavLink key={to} to={to} onClick={() => setIsOpen(false)} className={`px-4 py-4 rounded-[12px] text-white/90 text-[18px] font-[450] hover:bg-white/[0.06] transition-all duration-300 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3'}`} style={{ transitionDelay: isOpen ? `${100 + i * 50}ms` : '0ms' }}>{label}</NavLink>)}</div><div className="h-px bg-white/10 my-5" /><div className={`flex flex-col gap-3 transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`} style={{ transitionDelay: isOpen ? '350ms' : '0ms' }}><NavLink to="/register?role=owner" onClick={() => setIsOpen(false)} className="w-full h-[50px] bg-[#E9E9E9] rounded-[12px] text-[#0A0707] text-[15px] font-[450] flex items-center justify-center hover:bg-white">For shop owners</NavLink><NavLink to="/login?role=customer" onClick={() => setIsOpen(false)} className="w-full h-[50px] rounded-[12px] border border-white/30 text-white text-[15px] font-[450] flex items-center justify-center hover:bg-white/5">User Login</NavLink></div></div></div>
      <main className="flex-1"><Outlet /></main>
    </div>
  );
};

export default MainLayout;
