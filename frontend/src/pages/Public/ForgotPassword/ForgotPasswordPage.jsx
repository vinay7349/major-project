import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { useToast } from '../../../context/NotificationContext';
import GlassCard from '../../../components/GlassCard';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    addToast(`Password reset link sent to ${email}`, 'success');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-white">Reset Password</h2>
          <p className="text-slate-400 text-xs">Enter your email address to receive password recovery instructions.</p>
        </div>

        <GlassCard className="bg-slate-900/70 border-slate-800 p-8">
          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="owner@shopgenie.ai"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full gradient-btn-primary py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Reset Link</span>
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Check Your Inbox</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                We sent a password reset token to <span className="font-semibold text-slate-200">{email}</span>. Follow the link inside to set a new password.
              </p>
            </div>
          )}
        </GlassCard>

        <div className="text-center">
          <NavLink to="/login" className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300">
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
