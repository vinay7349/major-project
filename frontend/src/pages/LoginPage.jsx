import React, { useState } from 'react';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/NotificationContext';

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const isCustomerLogin = searchParams.get('role') === 'customer';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, logout, loading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(username, password, isCustomerLogin ? 'customer' : 'owner');
    if (result.success && (!isCustomerLogin || result.user.role === 'CUSTOMER') && (isCustomerLogin || result.user.role !== 'CUSTOMER')) {
      addToast(`Welcome back, ${result.user.username}!`, 'success', 'Login Successful');
      navigate(result.user.role === 'CUSTOMER' ? '/customer' : '/dashboard');
    } else if (result.success) {
      logout();
      addToast(`This account is registered as ${result.user.role === 'CUSTOMER' ? 'a customer' : 'a shop owner'}. Use the matching login.` , 'error', 'Wrong Login Type');
    } else {
      addToast('Invalid credentials. Try demo credentials: shopowner / owner123', 'error', 'Login Failed');
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-[#080A19] text-white">
      <video className="absolute inset-0 h-full w-full object-cover opacity-45" src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260813_092641_de52eb87-daf2-41db-92cb-7a56eae012a5.mp4" autoPlay loop muted playsInline />
      <div className="absolute inset-0 bg-[#080A19]/60" />
      <div className="relative z-10 w-full max-w-[1800px] mx-auto px-5 py-8 sm:px-8 sm:py-12 md:px-[82px] lg:min-h-[calc(100vh-5rem)] lg:flex lg:items-center lg:justify-center">
        <section className="w-full max-w-[680px] mx-auto rounded-[24px] sm:rounded-[33px] border border-white/[0.08] bg-[rgba(17,16,15,0.52)] p-6 sm:p-10 lg:p-12 backdrop-blur-[20px] shadow-2xl shadow-black/30">
            <NavLink to="/" className="inline-flex text-sm text-white/65 transition-colors hover:text-white">Home<span className="mx-2">&gt;</span><span className="text-white">Sign In</span></NavLink>
            <div className="mt-8 mb-8 sm:mt-10 sm:mb-10"><div className="w-11 h-11 rounded-[12px] bg-white/10 flex items-center justify-center mb-5"><LogIn className="w-5 h-5 text-white" /></div><h1 className="text-[38px] sm:text-[48px] font-normal leading-[0.95] tracking-[-0.035em]">Sign In</h1><p className="mt-4 text-[16px] sm:text-[18px] font-[450] leading-[1.3] text-white/80">Welcome back! Please sign in to your account.</p></div>
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              <div><label className="mb-2 block text-sm font-[450] text-white/90">Email Address <span className="text-white/50">*</span></label><div className="relative"><Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" /><input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your email address" className="w-full h-[52px] rounded-[12px] border border-white/[0.12] bg-white/[0.06] py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-white/40 focus:bg-white/[0.1] focus:ring-4 focus:ring-white/[0.06]" /></div></div>
              <div><div className="mb-2 flex items-center justify-between gap-3"><label className="block text-sm font-[450] text-white/90">Password <span className="text-white/50">*</span></label><NavLink to="/forgot-password" className="text-sm font-[450] text-white/70 transition-colors hover:text-white">Forgot Password?</NavLink></div><div className="relative"><Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" /><input type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="w-full h-[52px] rounded-[12px] border border-white/[0.12] bg-white/[0.06] py-3 pl-11 pr-12 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-white/40 focus:bg-white/[0.1] focus:ring-4 focus:ring-white/[0.06]" /><button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/45 transition-colors hover:text-white">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></div>
              <button type="submit" disabled={loading} className="w-full h-[52px] rounded-[12px] bg-[#E9E9E9] text-[#0A0707] text-[15px] font-[450] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'Authenticating...' : 'Sign In'}</button>
            </form>
            <div className="mt-7 border-t border-white/10 pt-6 text-center text-sm text-white/65">Don't have an account? <NavLink to={`/register${isCustomerLogin ? '?role=customer' : ''}`} className="font-[450] text-white transition-colors hover:text-white/70">Register</NavLink></div>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
