import React, { useState } from 'react';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User as UserIcon, Store } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/NotificationContext';

const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const isCustomer = searchParams.get('role') === 'customer';
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: isCustomer ? 'CUSTOMER' : 'SHOP_OWNER',
    shop_name: '',
    phone_number: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const { register, loading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await register(formData);
    if (res.success) {
      addToast('Registration complete! Please sign in with your new account.', 'success', 'Account Created');
      navigate('/customer/login');
    } else {
      addToast('Registration error. Please check your form fields.', 'error');
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-background dark:bg-background-dark text-text-primary dark:text-text-dark font-sans relative overflow-hidden transition-colors duration-300">
      {/* Ambient light blobs */}
      <div className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-accent/25 blur-3xl pointer-events-none dark:bg-accent/10" />
      <div className="absolute top-1/3 -right-40 w-[480px] h-[480px] rounded-full bg-accent-light/20 blur-3xl pointer-events-none dark:bg-accent-light/10" />
      <div className="absolute -bottom-40 left-1/4 w-[380px] h-[380px] rounded-full bg-accent/30 blur-3xl pointer-events-none dark:bg-accent/10" />

      {/* Top brand bar */}
      <header className="relative z-20 w-full border-b border-border dark:border-border-dark bg-surface/95 dark:bg-surface-dark/95 backdrop-blur-sm">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <NavLink to="/" className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-button bg-gradient-to-br from-accent to-accent-light text-white shadow-lg shadow-accent/20">
              <Store className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-text-primary dark:text-text-dark">ShopGenie</span>
                <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-[10px] font-semibold text-accent border border-accent/20 dark:bg-accent/15 dark:text-accent-300 dark:border-accent/30">
                  {isCustomer ? 'Customer' : 'Shop Owner'}
                </span>
              </div>
              <p className="text-[11px] text-text-muted dark:text-text-mutedDark">Create your account</p>
            </div>
          </NavLink>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 mx-auto w-full max-w-7xl px-6 py-10 lg:py-14 flex-1 flex flex-col justify-center">
        <section className="relative h-48 overflow-hidden rounded-card bg-gradient-to-r from-accent via-accent to-accent-light mb-8 shadow-modal">
          <div className="absolute inset-0 bg-overlay" />
          <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
            <h1 className="text-4xl font-bold">Create Account</h1>
            <p className="mt-3 text-sm text-white/80">Join ShopGenie and connect with your local retail community.</p>
          </div>
        </section>

        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Retail Scene */}
          <div className="lg:col-span-5 relative hidden lg:block">
            <div className="relative h-[560px]">
              {/* Floating product boxes */}
              <div className="absolute left-[6%] top-[6%] h-36 w-36 rounded-3xl bg-white shadow-[0_25px_60px_-15px_rgba(79,70,229,0.35)] border border-white p-3 rotate-[-7deg] dark:bg-charcoal/60 dark:border-charcoal">
                <div className="h-full rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
                  <Store className="h-12 w-12 text-charcoal" />
                </div>
                <div className="absolute -bottom-2 left-4 right-4 rounded-lg bg-white shadow-sm px-2 py-1 text-[10px] font-semibold text-slate dark:bg-charcoal dark:text-slate/80">Shop Owner</div>
              </div>
              <div className="absolute left-[26%] top-[38%] h-44 w-44 rounded-[30px] bg-white shadow-[0_30px_70px_-15px_rgba(79,70,229,0.4)] border border-slate-100 p-4 rotate-[5deg] z-10 dark:bg-charcoal/60 dark:border-charcoal">
                <div className="h-full rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
                  <UserIcon className="h-14 w-14 text-blue-500" />
                </div>
                <div className="absolute -bottom-2 left-4 right-4 rounded-lg bg-white shadow-sm px-2 py-1 text-[10px] font-semibold text-slate dark:bg-charcoal dark:text-slate/80">Customer</div>
              </div>
              <div className="absolute left-[4%] top-[68%] h-32 w-32 rounded-3xl bg-white shadow-[0_25px_60px_-15px_rgba(79,70,229,0.3)] border border-white p-3 rotate-[-4deg] dark:bg-charcoal/60 dark:border-charcoal">
                <div className="h-full rounded-2xl bg-gradient-to-br from-sky-50 to-blue-100 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
                  <Store className="h-10 w-10 text-sky-500" />
                </div>
                <div className="absolute -bottom-2 left-3 right-3 rounded-lg bg-white shadow-sm px-2 py-1 text-[10px] font-semibold text-slate dark:bg-charcoal dark:text-slate/80">Local Shops</div>
              </div>

              {/* Floating orbs */}
              <div className="absolute left-[38%] top-[75%] h-6 w-6 rounded-full bg-accent/40 blur-[2px]" />
              <div className="absolute left-[55%] top-[62%] h-4 w-4 rounded-full bg-accent-light/40 blur-[2px]" />
              <div className="absolute left-[70%] top-[85%] h-8 w-8 rounded-full bg-accent/40 blur-[3px]" />
            </div>
          </div>

          {/* Right Column: Registration Card */}
          <div className="lg:col-span-7">
            <div className="card p-6 sm:p-9 shadow-modal space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-gradient-to-br from-accent/10 to-accent-light/10 pointer-events-none" />

              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-button bg-gradient-to-br from-accent to-accent-light text-white shadow-lg shadow-accent/25">
                    {isCustomer ? <UserIcon className="h-5 w-5" /> : <Store className="h-5 w-5" />}
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold tracking-tight text-text-primary dark:text-text-dark">
                      {isCustomer ? 'Create Customer Account' : 'Set Up Your Shop'}
                    </h2>
                    <p className="text-xs text-text-muted dark:text-text-mutedDark">
                      {isCustomer ? 'Discover products and nearby shops' : 'Manage your shop with an owner account'}
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-text-primary dark:text-text-dark mb-1.5">First Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted dark:text-text-mutedDark" />
                      <input
                        type="text"
                        name="first_name"
                        required
                        value={formData.first_name}
                        onChange={handleChange}
                        placeholder="John"
                        className="h-12 w-full rounded-input border border-border dark:border-border-dark bg-background dark:bg-background-dark pl-10 pr-4 text-xs sm:text-sm text-text-primary dark:text-text-dark placeholder-text-text-muted dark:placeholder-text-text-mutedDark outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all shadow-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-primary dark:text-text-dark mb-1.5">Last Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted dark:text-text-mutedDark" />
                      <input
                        type="text"
                        name="last_name"
                        required
                        value={formData.last_name}
                        onChange={handleChange}
                        placeholder="Doe"
                        className="h-12 w-full rounded-input border border-border dark:border-border-dark bg-background dark:bg-background-dark pl-10 pr-4 text-xs sm:text-sm text-text-primary dark:text-text-dark placeholder-text-text-muted dark:placeholder-text-text-mutedDark outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary dark:text-text-dark mb-1.5">Username</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted dark:text-text-mutedDark" />
                    <input
                      type="text"
                      name="username"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="johndoe_shop"
                      className="h-12 w-full rounded-input border border-border dark:border-border-dark bg-background dark:bg-background-dark pl-10 pr-4 text-xs sm:text-sm text-text-primary dark:text-text-dark placeholder-text-text-muted dark:placeholder-text-text-mutedDark outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary dark:text-text-dark mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted dark:text-text-mutedDark" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@shopgenie.ai"
                      className="h-12 w-full rounded-input border border-border dark:border-border-dark bg-background dark:bg-background-dark pl-10 pr-4 text-xs sm:text-sm text-text-primary dark:text-text-dark placeholder-text-text-muted dark:placeholder-text-text-mutedDark outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary dark:text-text-dark mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted dark:text-text-mutedDark" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="h-12 w-full rounded-input border border-border dark:border-border-dark bg-background dark:bg-background-dark pl-10 pr-10 text-xs sm:text-sm text-text-primary dark:text-text-dark placeholder-text-text-muted dark:placeholder-text-text-mutedDark outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted dark:text-text-mutedDark hover:text-text-primary dark:hover:text-text-dark transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {!isCustomer && (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-text-primary dark:text-text-dark mb-1.5">Shop Name</label>
                      <div className="relative">
                        <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted dark:text-text-mutedDark" />
                        <input
                          type="text"
                          name="shop_name"
                          value={formData.shop_name}
                          onChange={handleChange}
                          placeholder="Green Valley Mart"
                          className="h-12 w-full rounded-input border border-border dark:border-border-dark bg-background dark:bg-background-dark pl-10 pr-4 text-xs sm:text-sm text-text-primary dark:text-text-dark placeholder-text-text-muted dark:placeholder-text-text-mutedDark outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all shadow-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-text-primary dark:text-text-dark mb-1.5">Role Access</label>
                      <input type="hidden" name="role" value="SHOP_OWNER" />
                      <div className="flex h-12 items-center rounded-input border border-border dark:border-border-dark bg-background dark:bg-background-dark px-4 text-xs sm:text-sm text-text-primary dark:text-text-dark">
                        Shop Owner
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-button btn-primary text-white text-xs sm:text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-accent/25 hover:shadow-xl disabled:opacity-50"
                >
                  {loading ? 'Creating Account...' : (isCustomer ? 'Create Customer Account' : 'Create Shop Account')}
                </button>
              </form>

              <div className="pt-4 border-t border-border dark:border-border-dark text-center">
                <p className="text-xs text-text-muted dark:text-text-mutedDark">
                  Already have an account?{' '}
                  <NavLink
                    to="/customer/login"
                    className="font-bold text-accent hover:text-accent transition-colors dark:text-accent-400 dark:hover:text-accent-300"
                  >
                    Sign in
                  </NavLink>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border dark:border-border-dark py-6 text-center text-xs text-text-muted dark:text-text-mutedDark">
        <p>© 2026 ShopGenie AI — Smart Retail &amp; Product Discovery Platform</p>
      </footer>
    </div>
  );
};

export default RegisterPage;


