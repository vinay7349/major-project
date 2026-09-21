import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const redirectTo = location.state?.from || '/customer';

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password, 'customer');
    if (result.success) {
      addToast(`Welcome to ShopGenie, ${result.user.username || 'Customer'}!`, 'success', 'Sign In Successful');
      navigate(redirectTo, { replace: true });
    } else {
      addToast('Sign in failed. Try using demo customer access below.', 'error', 'Authentication Failed');
    }
  };

  const handleDemoCustomerLogin = async () => {
    const result = await login('demo_customer', 'customer123', 'customer');
    if (result.success) {
      addToast('Signed in as Demo Customer!', 'success', 'Demo Session Started');
      navigate(redirectTo, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-warmwhite text-navy font-sans relative overflow-hidden flex flex-col dark:bg-navy dark:text-slate/60 transition-colors duration-300">
      {/* Ambient warm blobs matching ShopGenie palette */}
      <div className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-amber-200/20 blur-3xl pointer-events-none dark:bg-amber/5" />
      <div className="absolute top-1/3 -right-40 w-[480px] h-[480px] rounded-full bg-orange-200/20 blur-3xl pointer-events-none dark:bg-orange-500/5" />
      <div className="absolute -bottom-40 left-1/4 w-[380px] h-[380px] rounded-full bg-amber-100/30 blur-3xl pointer-events-none dark:bg-amber/5" />

      {/* Top brand bar */}
      <header className="relative z-20 w-full border-b border-warmwhite/60/80 bg-warmwhite/90 backdrop-blur-xl dark:border-charcoal dark:bg-navy/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <NavLink to="/customer" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber text-white shadow-sm shadow-amber/25 ring-4 ring-amber/10">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="leading-none">
              <div className="flex items-center gap-2">
                <span className="text-[17px] font-bold tracking-tight text-navy dark:text-white">ShopGenie</span>
                <span className="rounded-full border border-amber/20 bg-amber/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-amber dark:text-amber-300">
                  Local
                </span>
              </div>
              <p className="mt-0.5 text-[10px] text-slate dark:text-slate/80">Find products &amp; local shops near you</p>
            </div>
          </NavLink>
          <NavLink to="/customer" className="text-xs font-semibold text-slate hover:text-amber dark:text-slate/80 dark:hover:text-amber-400 transition-colors">
            ← Back to discovery
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
                  <Package className="h-12 w-12 text-charcoal" />
                </div>
                <div className="absolute -bottom-2 left-4 right-4 rounded-lg bg-white shadow-sm px-2 py-1 text-[10px] font-semibold text-slate">Groceries</div>
              </div>
              <div className="absolute left-[26%] top-[38%] h-44 w-44 rounded-[30px] bg-white shadow-[0_30px_70px_-15px_rgba(79,70,229,0.4)] border border-slate-100 p-4 rotate-[5deg] z-10">
                <div className="h-full rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center">
                  <StoreIcon className="h-14 w-14 text-blue-500" />
                </div>
                <div className="absolute -bottom-2 left-4 right-4 rounded-lg bg-white shadow-sm px-2 py-1 text-[10px] font-semibold text-slate">Local Shops</div>
              </div>
              <div className="absolute left-[4%] top-[68%] h-32 w-32 rounded-3xl bg-white shadow-[0_25px_60px_-15px_rgba(79,70,229,0.3)] border border-white p-3 rotate-[-4deg]">
                <div className="h-full rounded-2xl bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center">
                  <Tag className="h-10 w-10 text-sky-500" />
                </div>
                <div className="absolute -bottom-2 left-3 right-3 rounded-lg bg-white shadow-sm px-2 py-1 text-[10px] font-semibold text-slate">Price Compare</div>
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
                <div><p className="text-xs font-bold text-charcoal">Nearby</p><p className="text-[10px] text-slate">2.4 km away</p></div>
              </div>

              {/* Search chip */}
              <div className="absolute right-[4%] top-[40%] rounded-2xl bg-white shadow-[0_20px_50px_-15px_rgba(79,70,229,0.3)] border border-slate-100 px-4 py-3 flex items-center gap-3 rotate-[-5deg]">
                <div className="h-9 w-9 rounded-full bg-charcoal/10 flex items-center justify-center"><Search className="h-4.5 w-4.5 text-charcoal" /></div>
                <div><p className="text-xs font-bold text-charcoal">In Stock</p><p className="text-[10px] text-slate">Available now</p></div>
              </div>

              {/* Trust chip */}
              <div className="absolute right-[8%] top-[70%] rounded-2xl bg-white shadow-[0_20px_50px_-15px_rgba(79,70,229,0.25)] border border-slate-100 px-4 py-3 flex items-center gap-3 rotate-[4deg]">
                <div className="h-9 w-9 rounded-full bg-charcoal/10 flex items-center justify-center"><ShieldCheck className="h-4.5 w-4.5 text-charcoal" /></div>
                <div><p className="text-xs font-bold text-charcoal">Trusted</p><p className="text-[10px] text-slate">Verified shops</p></div>
              </div>

              {/* Floating orbs (decoration) */}
              <div className="absolute left-[38%] top-[75%] h-6 w-6 rounded-full bg-blue-400/40 blur-[2px]" />
              <div className="absolute left-[55%] top-[62%] h-4 w-4 rounded-full bg-indigo-400/40 blur-[2px]" />
              <div className="absolute left-[70%] top-[85%] h-8 w-8 rounded-full bg-sky-300/40 blur-[3px]" />
            </div>

            {/* Mobile / tablet compact intro */}
            <div className="lg:hidden text-center max-w-md mx-auto mb-8">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 shadow-xl shadow-charcoal/30 mb-4">
                <ShoppingBag className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-navy dark:text-white">Welcome back</h1>
              <p className="mt-2 text-slate dark:text-slate/80 text-sm">Access your saved items &amp; customer profile.</p>
            </div>
          </div>

          {/* Right Column: Customer Authentication Card */}
          <div className="lg:col-span-5">
            <div className="rounded-[28px] border border-warmwhite/60 bg-white/90 backdrop-blur-2xl p-6 sm:p-9 shadow-[0_40px_90px_-30px_rgba(245,158,11,0.2)] space-y-6 relative overflow-hidden dark:border-charcoal dark:bg-charcoal/80 dark:shadow-[0_40px_90px_-30px_rgba(0,0,0,0.7)]">
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-gradient-to-br from-blue-500/10 to-violet-500/10 pointer-events-none" />

              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber text-white shadow-lg shadow-amber/25">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold tracking-tight text-navy dark:text-white">Sign in to ShopGenie</h2>
                    <p className="text-xs text-slate dark:text-slate/80">Access saved shops, products &amp; your cart</p>
                  </div>
                </div>
              </div>

              {/* 1-Click Demo Customer Access Button */}
              <button
                onClick={handleDemoCustomerLogin}
                type="button"
                className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-amber/30 bg-amber/10 py-3 px-4 text-xs font-bold text-amber hover:border-amber/60 hover:bg-amber/15 hover:text-amber transition-all shadow-sm dark:text-amber-300 dark:hover:text-amber-200">
                <Zap className="h-4 w-4 text-amber fill-amber-500 dark:text-amber-400 dark:fill-amber-400" />
                <span>Continue with 1-Click Demo Customer</span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="w-full border-t border-warmwhite/60 dark:border-charcoal"></div>
                <span className="absolute bg-white dark:bg-charcoal px-3 text-[11px] uppercase font-bold tracking-wider text-slate/80 dark:text-slate">
                  Or
                </span>
              </div>

              {/* Customer Credentials Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal dark:text-slate/60 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate/80 dark:text-slate" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="customer@example.com"
                      className="h-12 w-full rounded-xl border border-warmwhite/60 bg-white pl-10 pr-4 text-xs sm:text-sm text-navy placeholder-slate-400 outline-none focus:border-amber/60 focus:ring-2 focus:ring-amber/15 transition-all shadow-sm dark:border-charcoal dark:bg-charcoal dark:text-white dark:placeholder-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-charcoal dark:text-slate/60">
                      Password
                    </label>
                    <NavLink
                      to="/forgot-password"
                      className="text-xs font-medium text-amber hover:text-amber transition-colors dark:text-amber-400 dark:hover:text-amber-300"
                    >
                      Forgot password?
                    </NavLink>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate/80 dark:text-slate" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-12 w-full rounded-xl border border-warmwhite/60 bg-white pl-10 pr-10 text-xs sm:text-sm text-navy placeholder-slate-400 outline-none focus:border-amber/60 focus:ring-2 focus:ring-amber/15 transition-all shadow-sm dark:border-charcoal dark:bg-charcoal dark:text-white dark:placeholder-slate-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate/80 hover:text-slate transition-colors dark:text-slate dark:hover:text-slate/60"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-charcoal text-white text-xs sm:text-sm font-bold hover:bg-charcoal transition-all shadow-lg shadow-slate-900/20 hover:shadow-xl disabled:opacity-50 dark:bg-amber dark:text-slate-950 dark:hover:bg-amber-400"
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>

              <div className="pt-4 border-t border-slate-100 dark:border-charcoal text-center">
                <p className="text-xs text-slate dark:text-slate/80">
                  New to ShopGenie?{' '}
                  <NavLink
                    to="/register?role=customer"
                    className="font-bold text-amber hover:text-amber transition-colors dark:text-amber-400"
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
      <footer className="relative z-10 border-t border-charcoal/5 py-6 text-center text-xs text-slate/80">
        <p>© 2026 ShopGenie AI — Smart Retail &amp; Product Discovery Platform</p>
      </footer>
    </div>
  );
};

export default CustomerLoginPage;




