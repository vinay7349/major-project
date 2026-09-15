import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  ShoppingBag, MapPin, Mail, Lock, Eye, EyeOff,
  Sparkles, Zap, Package, Search, ShieldCheck,
  Store as StoreIcon, Tag
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/NotificationContext';

const CustomerLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password, 'customer');
    if (result.success) {
      addToast(`Welcome to ShopGenie, ${result.user.username || 'Customer'}!`, 'success', 'Sign In Successful');
      navigate('/customer');
    } else {
      addToast('Sign in failed. Try using demo customer access below.', 'error', 'Authentication Failed');
    }
  };

  const handleDemoCustomerLogin = async () => {
    const result = await login('demo_customer', 'customer123', 'customer');
    if (result.success) {
      addToast('Signed in as Demo Customer!', 'success', 'Demo Session Started');
      navigate('/customer');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef3fb] via-[#f6f7fc] to-[#eaeef9] text-slate-900 font-sans relative overflow-hidden flex flex-col dark:from-[#0b1220] dark:via-[#0d1526] dark:to-[#0a1019] dark:text-slate-100 transition-colors duration-300">
      {/* Ambient light blobs */}
      <div className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-blue-300/25 blur-3xl pointer-events-none dark:bg-blue-500/10" />
      <div className="absolute top-1/3 -right-40 w-[480px] h-[480px] rounded-full bg-indigo-300/20 blur-3xl pointer-events-none dark:bg-indigo-500/10" />
      <div className="absolute -bottom-40 left-1/4 w-[380px] h-[380px] rounded-full bg-sky-200/30 blur-3xl pointer-events-none dark:bg-sky-500/10" />

      {/* Top brand bar */}
      <header className="relative z-20 w-full border-b border-slate-900/5 bg-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/60">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <NavLink to="/" className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">ShopGenie</span>
                <span className="rounded-full bg-blue-600/10 px-2.5 py-0.5 text-[10px] font-semibold text-blue-700 border border-blue-600/20 dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-500/30">
                  Customer Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Find products &amp; local shops near you</p>
            </div>
          </NavLink>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 mx-auto w-full max-w-7xl px-6 py-10 lg:py-14 flex-1 flex flex-col justify-center">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">

          {/* Left Column: Retail Scene */}
          <div className="lg:col-span-7 relative">
            <div className="hidden lg:block relative h-[560px]">
              {/* Large floating product boxes */}
              <div className="absolute left-[6%] top-[6%] h-36 w-36 rounded-3xl bg-white shadow-[0_25px_60px_-15px_rgba(79,70,229,0.35)] border border-white p-3 rotate-[-7deg]">
                <div className="h-full rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                  <Package className="h-12 w-12 text-indigo-500" />
                </div>
                <div className="absolute -bottom-2 left-4 right-4 rounded-lg bg-white shadow-sm px-2 py-1 text-[10px] font-semibold text-slate-500">Groceries</div>
              </div>
              <div className="absolute left-[26%] top-[38%] h-44 w-44 rounded-[30px] bg-white shadow-[0_30px_70px_-15px_rgba(79,70,229,0.4)] border border-slate-100 p-4 rotate-[5deg] z-10">
                <div className="h-full rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center">
                  <StoreIcon className="h-14 w-14 text-blue-500" />
                </div>
                <div className="absolute -bottom-2 left-4 right-4 rounded-lg bg-white shadow-sm px-2 py-1 text-[10px] font-semibold text-slate-500">Local Shops</div>
              </div>
              <div className="absolute left-[4%] top-[68%] h-32 w-32 rounded-3xl bg-white shadow-[0_25px_60px_-15px_rgba(79,70,229,0.3)] border border-white p-3 rotate-[-4deg]">
                <div className="h-full rounded-2xl bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center">
                  <Tag className="h-10 w-10 text-sky-500" />
                </div>
                <div className="absolute -bottom-2 left-3 right-3 rounded-lg bg-white shadow-sm px-2 py-1 text-[10px] font-semibold text-slate-500">Price Compare</div>
              </div>

              {/* Floating smart shopping bag (center) */}
              <div className="absolute left-[45%] top-[25%] h-52 w-44 rounded-[32px] bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 shadow-[0_40px_80px_-20px_rgba(79,70,229,0.6)] border border-white/40 p-4 z-20 rotate-[-3deg]">
                <div className="h-full rounded-3xl bg-white/15 backdrop-blur-sm border border-white/30 flex flex-col items-center justify-center gap-3">
                  <ShoppingBag className="h-14 w-14 text-white" />
                  <p className="text-white text-sm font-bold tracking-tight">Smart Bag</p>
                  <div className="flex gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-white/70" /><span className="h-1.5 w-1.5 rounded-full bg-white/70" /><span className="h-1.5 w-1.5 rounded-full bg-white/70" /></div>
                </div>
              </div>

              {/* Mini map pin card */}
              <div className="absolute left-[62%] top-[6%] rounded-2xl bg-white shadow-[0_20px_50px_-15px_rgba(79,70,229,0.3)] border border-slate-100 px-4 py-3 flex items-center gap-3 rotate-[6deg]">
                <div className="h-9 w-9 rounded-full bg-blue-600/10 flex items-center justify-center"><MapPin className="h-4.5 w-4.5 text-blue-600" /></div>
                <div><p className="text-xs font-bold text-slate-800">Nearby</p><p className="text-[10px] text-slate-500">2.4 km away</p></div>
              </div>

              {/* Search chip */}
              <div className="absolute right-[4%] top-[40%] rounded-2xl bg-white shadow-[0_20px_50px_-15px_rgba(79,70,229,0.3)] border border-slate-100 px-4 py-3 flex items-center gap-3 rotate-[-5deg]">
                <div className="h-9 w-9 rounded-full bg-indigo-600/10 flex items-center justify-center"><Search className="h-4.5 w-4.5 text-indigo-600" /></div>
                <div><p className="text-xs font-bold text-slate-800">In Stock</p><p className="text-[10px] text-slate-500">Available now</p></div>
              </div>

              {/* Trust chip */}
              <div className="absolute right-[8%] top-[70%] rounded-2xl bg-white shadow-[0_20px_50px_-15px_rgba(79,70,229,0.25)] border border-slate-100 px-4 py-3 flex items-center gap-3 rotate-[4deg]">
                <div className="h-9 w-9 rounded-full bg-violet-600/10 flex items-center justify-center"><ShieldCheck className="h-4.5 w-4.5 text-violet-600" /></div>
                <div><p className="text-xs font-bold text-slate-800">Trusted</p><p className="text-[10px] text-slate-500">Verified shops</p></div>
              </div>

              {/* Floating orbs (decoration) */}
              <div className="absolute left-[38%] top-[75%] h-6 w-6 rounded-full bg-blue-400/40 blur-[2px]" />
              <div className="absolute left-[55%] top-[62%] h-4 w-4 rounded-full bg-indigo-400/40 blur-[2px]" />
              <div className="absolute left-[70%] top-[85%] h-8 w-8 rounded-full bg-sky-300/40 blur-[3px]" />
            </div>

            {/* Mobile / tablet compact intro */}
            <div className="lg:hidden text-center max-w-md mx-auto mb-8">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 shadow-xl shadow-indigo-500/30 mb-4">
                <ShoppingBag className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Welcome back</h1>
              <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm">Access your saved items &amp; customer profile.</p>
            </div>
          </div>

          {/* Right Column: Customer Authentication Card */}
          <div className="lg:col-span-5">
            <div className="rounded-[28px] border border-white/70 bg-white/80 backdrop-blur-2xl p-6 sm:p-9 shadow-[0_40px_90px_-30px_rgba(79,70,229,0.35)] space-y-6 relative overflow-hidden dark:border-white/10 dark:bg-slate-900/70 dark:shadow-[0_40px_90px_-30px_rgba(0,0,0,0.7)]">
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-gradient-to-br from-blue-500/10 to-violet-500/10 pointer-events-none" />

              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/25">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">Customer Sign In</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Access your saved items &amp; customer profile</p>
                  </div>
                </div>
              </div>

              {/* 1-Click Demo Customer Access Button */}
              <button
                onClick={handleDemoCustomerLogin}
                type="button"
                className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-indigo-500/30 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-violet-600/10 py-3 px-4 text-xs font-bold text-indigo-700 hover:border-indigo-500/60 hover:from-blue-600/15 hover:to-violet-600/15 hover:text-indigo-800 transition-all shadow-sm dark:text-indigo-300 dark:hover:text-indigo-200"
              >
                <Zap className="h-4 w-4 text-indigo-500 fill-indigo-500 dark:text-indigo-400 dark:fill-indigo-400" />
                <span>Continue with 1-Click Demo Customer</span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                <span className="absolute bg-white dark:bg-slate-900 px-3 text-[11px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
                  Or
                </span>
              </div>

              {/* Customer Credentials Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="customer@example.com"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                    <NavLink
                      to="/forgot-password"
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-500 transition-colors dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      Forgot password?
                    </NavLink>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors dark:text-slate-500 dark:hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs sm:text-sm font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 disabled:opacity-50"
                >
                  {loading ? 'Signing In...' : 'Sign In as Customer'}
                </button>
              </form>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  New to ShopGenie?{' '}
                  <NavLink
                    to="/register?role=customer"
                    className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors"
                  >
                    Create Customer Account
                  </NavLink>
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900/5 py-6 text-center text-xs text-slate-400">
        <p>© 2026 ShopGenie AI — Smart Retail &amp; Product Discovery Platform</p>
      </footer>
    </div>
  );
};

export default CustomerLoginPage;
