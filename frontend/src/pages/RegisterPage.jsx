import React, { useState } from 'react';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User as UserIcon, Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/NotificationContext';

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
      navigate('/login');
    } else {
      addToast('Registration error. Please check your form fields.', 'error');
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-slate-50 text-slate-900">
      <section className="relative h-56 overflow-hidden bg-slate-950" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&w=2200&q=85)', backgroundPosition: 'center', backgroundSize: 'cover' }}>
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px]" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
          <h1 className="text-4xl font-bold">Create Account</h1>
          <p className="mt-3 text-sm text-slate-200">Join ShopGenie and connect with your local retail community.</p>
        </div>
      </section>

      <div className="border-b border-slate-200 bg-white px-6 py-4"><div className="mx-auto max-w-6xl text-sm text-slate-500"><NavLink to="/" className="hover:text-indigo-600">Home</NavLink><span className="mx-2">&gt;</span><span className="font-medium text-slate-900">Create Account</span></div></div>

      <section className="flex -translate-y-2 justify-center px-5 py-12 sm:px-6 sm:py-16">
        <div className="w-full max-w-[580px] overflow-hidden rounded-2xl bg-white shadow-xl shadow-slate-200/70">
          <div className="bg-gradient-to-r from-[#6C3BFF] via-[#2563EB] to-[#00AEEF] px-8 py-7 text-center text-white sm:px-12"><h2 className="text-3xl font-bold">{isCustomer ? 'Create your shopper account' : 'Set up your shop'}</h2></div>
          <div className="px-6 py-8 sm:px-12 sm:py-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  required
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="John"
                  className="w-full rounded-lg border border-slate-200 px-4 py-3.5 text-sm text-[#172033] outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-sky-100"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  required
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Username</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="johndoe_shop"
                  className="w-full rounded-lg border border-slate-200 py-3.5 pl-11 pr-4 text-sm text-[#172033] outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-sky-100"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@shopgenie.ai"
                  className="w-full rounded-lg border border-slate-200 py-3.5 pl-11 pr-4 text-sm text-[#172033] outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-sky-100"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-slate-200 py-3.5 pl-11 pr-12 text-sm text-[#172033] outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-sky-100"
                />
                <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#2563EB]">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
              </div>
            </div>

            {!isCustomer && <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Shop Name</label>
                <input
                  type="text"
                  name="shop_name"
                  value={formData.shop_name}
                  onChange={handleChange}
                  placeholder="Green Valley Mart"
                  className="w-full rounded-lg border border-slate-200 px-4 py-3.5 text-sm text-[#172033] outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-sky-100"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Role Access</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3.5 text-sm text-[#172033] outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-sky-100"
                >
                  <option value="SHOP_OWNER">Shop Owner</option>
                  <option value="ADMIN">Administrator</option>
                  <option value="CUSTOMER">Customer</option>
                </select>
              </div>
            </div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-btn-primary py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 mt-4"
            >
              <span>{loading ? 'Creating Account...' : isCustomer ? 'Create shopper account' : 'Create shop account'}</span>
            </button>
          </form>
          </div>
          <div className="border-t border-slate-200 px-6 py-6 text-center text-sm text-slate-500 sm:px-12">Already have an account? <NavLink to={`/login${isCustomer ? '?role=customer' : ''}`} className="font-semibold text-[#2563EB] hover:text-[#6C3BFF]">Sign in</NavLink></div>
        </div>
      </section>
    </div>
  );
};

export default RegisterPage;
