import React, { useState } from 'react';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/NotificationContext';

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const isCustomerLogin = searchParams.get('role') === 'customer';
  const [username, setUsername] = useState('shopowner');
  const [password, setPassword] = useState('owner123');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(username, password);
    if (result.success) {
      addToast(`Welcome back, ${result.user.username}!`, 'success', 'Login Successful');
      navigate('/dashboard');
    } else {
      addToast('Invalid credentials. Try demo credentials: shopowner / owner123', 'error', 'Login Failed');
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-slate-50 text-slate-900">
      <section className="relative h-56 overflow-hidden bg-slate-950" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1515706886582-54c73c5eaf41?auto=format&fit=crop&w=2200&q=85)', backgroundPosition: 'center', backgroundSize: 'cover' }}>
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px]" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
          <h1 className="text-4xl font-bold">Sign In</h1>
          <p className="mt-3 text-sm text-slate-200">Welcome back! Please sign in to your account.</p>
        </div>
      </section>

      <div className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto max-w-6xl text-sm text-slate-500"><NavLink to="/" className="hover:text-indigo-600">Home</NavLink><span className="mx-2">&gt;</span><span className="font-medium text-slate-900">Sign In</span></div>
      </div>

      <section className="flex justify-center px-5 py-12 sm:px-6 sm:py-16">
        <div className="w-full max-w-[580px] overflow-hidden rounded-2xl bg-white shadow-xl shadow-slate-200/70">
          <div className="bg-gradient-to-r from-[#6C3BFF] via-[#2563EB] to-[#00AEEF] px-8 py-7 text-center text-white sm:px-12">
            <h2 className="text-3xl font-bold">Sign In</h2>
          </div>
          <div className="px-6 py-8 sm:px-12 sm:py-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#172033]">Email Address <span className="text-rose-500">*</span></label>
                <div className="relative"><Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your email address" className="w-full rounded-lg border border-slate-200 py-3.5 pl-11 pr-4 text-sm text-[#172033] outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-sky-100" /></div>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between"><label className="block text-sm font-semibold text-[#172033]">Password <span className="text-rose-500">*</span></label><NavLink to="/forgot-password" className="text-sm font-medium text-[#2563EB] hover:text-[#6C3BFF]">Forgot Password?</NavLink></div>
                <div className="relative"><Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="w-full rounded-lg border border-slate-200 py-3.5 pl-11 pr-12 text-sm text-[#172033] outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-sky-100" /><button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#2563EB]">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>
              </div>
              <button type="submit" disabled={loading} className="gradient-btn-primary w-full rounded-lg py-3.5 text-sm font-bold hover:-translate-y-0.5 hover:shadow-lg">{loading ? 'Authenticating...' : 'Sign In'}</button>
            </form>
          </div>
          <div className="border-t border-slate-200 px-6 py-6 text-center text-sm text-slate-500 sm:px-12">Don't have an account? <NavLink to={`/register${isCustomerLogin ? '?role=customer' : ''}`} className="font-semibold text-[#2563EB] hover:text-[#6C3BFF]">Register</NavLink></div>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
