import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogIn, Lock, User as UserIcon, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/NotificationContext';
import GlassCard from '../components/GlassCard';

const LoginPage = () => {
  const [username, setUsername] = useState('shopowner');
  const [password, setPassword] = useState('owner123');
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
    <div className="min-h-[85vh] flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> ShopGenie AI Login
          </div>
          <h2 className="text-3xl font-extrabold text-white">Sign In to Store</h2>
          <p className="text-slate-400 text-xs">Enter your credentials to access your retail management dashboard.</p>
        </div>

        <GlassCard className="bg-slate-900/70 border-slate-800 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Username</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. shopowner or admin"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-slate-300">Password</label>
                <NavLink to="/forgot-password" className="text-[11px] text-indigo-400 hover:text-indigo-300">Forgot?</NavLink>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-btn-primary py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            </button>

            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-300 space-y-1">
              <p className="font-semibold">Demo Credentials:</p>
              <p>Shop Owner: <span className="font-mono text-white">shopowner</span> / <span className="font-mono text-white">owner123</span></p>
              <p>Admin: <span className="font-mono text-white">admin</span> / <span className="font-mono text-white">admin123</span></p>
            </div>
          </form>
        </GlassCard>

        <p className="text-center text-xs text-slate-400">
          Don't have an account? <NavLink to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold">Register here</NavLink>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
