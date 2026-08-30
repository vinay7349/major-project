import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  MapPin,
  Search,
  ArrowRight,
  LogIn,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Store,
  CheckCircle,
  Sparkles,
  Zap
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
    <div className="min-h-screen bg-[#080A19] text-white font-sans relative overflow-hidden flex flex-col justify-between">
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-30 pointer-events-none"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260813_092641_de52eb87-daf2-41db-92cb-7a56eae012a5.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#080A19]/90 via-[#080A19]/80 to-[#080A19] pointer-events-none" />

      <header className="relative z-20 w-full border-b border-white/10 bg-slate-950/40 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <NavLink to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 font-bold text-white shadow-lg shadow-cyan-500/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white">ShopGenie</span>
                <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-cyan-400 border border-cyan-500/20">
                  Customer Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Find products & local shops near you</p>
            </div>
          </NavLink>

          <NavLink
            to="/login?role=owner"
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-all"
          >
            <Store className="h-4 w-4 text-indigo-400" />
            <span>Are you a Shop Owner?</span>
          </NavLink>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-7xl px-6 py-12 lg:py-16 flex-1 flex flex-col justify-center">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-cyan-300 backdrop-blur-md">
              <MapPin className="h-3.5 w-3.5 text-cyan-400" />
              <span>Hyper-Local Product Discovery</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Find products near you, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400">instantly.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Explore live inventory, check nearby store stock, compare prices, and connect with trusted neighborhood retailers in real-time.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-900/50 p-4 backdrop-blur-md">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Search className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Live Stock Search</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Search products before visiting the shop</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-900/50 p-4 backdrop-blur-md">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <ShoppingBag className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Side-by-Side Comparison</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Compare prices & availability across stores</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-500/15 via-indigo-500/10 to-transparent p-5 backdrop-blur-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-cyan-400" />
                    Want to browse immediately without signing in?
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    You can search products and discover nearby stores right now as a guest.
                  </p>
                </div>
                <NavLink
                  to="/customer"
                  className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-indigo-500 transition-all"
                >
                  <span>Explore as Guest</span>
                  <ArrowRight className="h-4 w-4" />
                </NavLink>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-6">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    <LogIn className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Customer Sign In</h2>
                    <p className="text-xs text-slate-400">Access your saved items & customer profile</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleDemoCustomerLogin}
                type="button"
                className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-cyan-400/40 bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-purple-500/20 py-3 px-4 text-xs font-bold text-cyan-200 hover:border-cyan-400 hover:bg-cyan-500/30 hover:text-white transition-all shadow-md"
              >
                <Zap className="h-4 w-4 text-cyan-400 fill-cyan-400" />
                <span>Continue with 1-Click Demo Customer</span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="w-full border-t border-white/10"></div>
                <span className="absolute bg-slate-900 px-3 text-[11px] uppercase font-bold tracking-wider text-slate-500">
                  Or Sign In with Email
                </span>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="customer@example.com"
                      className="h-12 w-full rounded-xl border border-white/10 bg-slate-950/50 pl-10 pr-4 text-sm text-white placeholder-slate-500 transition-all outline-none focus:border-cyan-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="h-12 w-full rounded-xl border border-white/10 bg-slate-950/50 pl-10 pr-11 text-sm text-white placeholder-slate-500 transition-all outline-none focus:border-cyan-500/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-indigo-500 transition-all disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? 'Signing in...' : 'Sign In to My Account'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-300">
                <div className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 text-emerald-400" />
                  <span>Demo account access is available for customer testing and design review.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerLoginPage;
