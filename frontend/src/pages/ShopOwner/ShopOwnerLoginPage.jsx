import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BarChart3,
  Eye,
  EyeOff,
  Lock,
  Package,
  ShieldCheck,
  Store,
  UserRound,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/NotificationContext';

const OWNER_ROLES = ['SHOP_OWNER', 'ADMIN'];

const ShopOwnerLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, logout, user, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/shop-owner/dashboard';

  useEffect(() => {
    if (isAuthenticated && OWNER_ROLES.includes(user?.role)) {
      navigate('/shop-owner/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate, user]);

  const handleLogin = async (event) => {
    event.preventDefault();

    const result = await login(username, password, 'shop_owner');
    if (!result.success) {
      addToast('We could not sign in with those details.', 'error', 'Sign in failed');
      return;
    }

    if (!OWNER_ROLES.includes(result.user?.role)) {
      logout();
      addToast('This account does not have Shop Owner access.', 'error', 'Access restricted');
      return;
    }

    addToast(`Welcome back, ${result.user.first_name || result.user.username}.`, 'success', 'Owner access granted');
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="min-h-screen bg-warmwhite text-navy font-sans dark:bg-navy dark:text-slate/60">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-amber-200/20 blur-3xl dark:bg-amber/10" />
        <div className="absolute bottom-0 right-0 h-[360px] w-[360px] rounded-full bg-emerald-200/15 blur-3xl dark:bg-mutedgreen/5" />
      </div>

      <header className="relative z-10 border-b border-warmwhite/60/80 bg-white/70 backdrop-blur-xl dark:border-charcoal dark:bg-navy/70">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <NavLink to="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber text-white shadow-sm shadow-amber/25">
              <Store className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[17px] font-bold tracking-tight text-navy dark:text-white">ShopGenie</span>
                <span className="rounded-full border border-amber/20 bg-amber/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-amber dark:text-amber-300">
                  Shop Management
                </span>
              </div>
              <p className="mt-0.5 text-[10px] text-slate dark:text-slate/80">Owner workspace</p>
            </div>
          </NavLink>
          <NavLink
            to="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate transition-colors hover:text-amber dark:text-slate/80 dark:hover:text-amber-400"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to ShopGenie
          </NavLink>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col justify-center px-6 py-10 lg:px-8 lg:py-14">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <section className="relative lg:col-span-6">
            <div className="hidden lg:block">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-mutedgreen/20 bg-mutedgreen/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-mutedgreen dark:text-emerald-300">
                <ShieldCheck className="h-3.5 w-3.5" />
                Secure owner access
              </div>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-navy dark:text-white xl:text-[54px]">
                Run your shop from one focused workspace.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate dark:text-slate/60">
                Manage your products, inventory, prices, sales, bills, analytics, shop profile, updates, and customer activity without leaving ShopGenie.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {[
                  { icon: Package, title: 'Catalog & stock', text: 'Keep products, prices, and availability current.' },
                  { icon: BarChart3, title: 'Sales insight', text: 'Review orders, bills, and practical performance trends.' },
                  { icon: Store, title: 'Shop profile', text: 'Control the information customers see in discovery.' },
                  { icon: UserRound, title: 'Customer activity', text: 'Follow updates, comments, and shopper engagement.' },
                ].map(({ icon: Icon, title, text }) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-warmwhite/60 bg-white/70 p-5 backdrop-blur-sm dark:border-charcoal dark:bg-charcoal/60"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber/10 text-amber dark:text-amber-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="mt-4 text-sm font-bold text-navy dark:text-white">{title}</h2>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate dark:text-slate/80">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:hidden">
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber text-white shadow-lg shadow-amber/20">
                <Store className="h-7 w-7" />
              </div>
              <h1 className="text-center text-3xl font-extrabold tracking-tight text-navy dark:text-white">
                Shop Owner sign in
              </h1>
              <p className="mx-auto mt-3 max-w-sm text-center text-sm text-slate dark:text-slate/80">
                Manage your shop catalog, stock, sales, and profile.
              </p>
            </div>
          </section>

          <section className="lg:col-span-6">
            <div className="mx-auto w-full max-w-md rounded-[28px] border border-warmwhite/60 bg-white/90 p-6 shadow-xl shadow-stone-300/30 backdrop-blur-2xl dark:border-charcoal dark:bg-charcoal/80 dark:shadow-black/30 sm:p-9">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-charcoal text-white dark:bg-amber dark:text-slate-950">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold tracking-tight text-navy dark:text-white">
                    Shop Owner / Admin Login
                  </h2>
                  <p className="mt-1 text-xs text-slate dark:text-slate/80">
                    Access your dedicated Shop Owner Dashboard
                  </p>
                </div>
              </div>

              <form className="mt-8 space-y-5" onSubmit={handleLogin}>
                <div>
                  <label htmlFor="owner-username" className="mb-1.5 block text-xs font-bold text-charcoal dark:text-slate/60">
                    Username
                  </label>
                  <div className="relative">
                    <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate/80" />
                    <input
                      id="owner-username"
                      type="text"
                      autoComplete="username"
                      required
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      placeholder="shopowner"
                      className="h-12 w-full rounded-xl border border-warmwhite/60 bg-white pl-10 pr-4 text-sm text-navy outline-none placeholder:text-slate/80 focus:border-amber focus:ring-2 focus:ring-amber/15 dark:border-charcoal dark:bg-charcoal dark:text-white dark:placeholder:text-slate"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label htmlFor="owner-password" className="text-xs font-bold text-charcoal dark:text-slate/60">
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate/80" />
                    <input
                      id="owner-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter your password"
                      className="h-12 w-full rounded-xl border border-warmwhite/60 bg-white pl-10 pr-12 text-sm text-navy outline-none placeholder:text-slate/80 focus:border-amber focus:ring-2 focus:ring-amber/15 dark:border-charcoal dark:bg-charcoal dark:text-white dark:placeholder:text-slate"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((visible) => !visible)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate/80 transition-colors hover:text-slate dark:hover:text-slate/60"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-charcoal text-sm font-bold text-white transition-all hover:bg-charcoal focus:outline-none focus:ring-2 focus:ring-slate-900/20 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-amber dark:text-slate-950 dark:hover:bg-amber-400 dark:focus:ring-amber/20"
                >
                  <ShieldCheck className="h-4 w-4" />
                  {loading ? 'Signing in...' : 'Open Shop Owner Dashboard'}
                </button>
              </form>

              <div className="mt-6 rounded-xl bg-warmwhite p-4 dark:bg-charcoal/60">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-mutedgreen dark:text-emerald-400" />
                  <p className="text-[11px] leading-relaxed text-slate dark:text-slate/80">
                    This entry point is only for authorized shop owners and administrators. Customer accounts cannot access shop management.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ShopOwnerLoginPage;


