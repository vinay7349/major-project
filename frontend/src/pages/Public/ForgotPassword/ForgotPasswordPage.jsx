import React, { useState } from 'react';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, ArrowLeft, Send, Lock } from 'lucide-react';
import { useToast } from '../../../context/NotificationContext';
import { authAPI } from '../../../services/api';
import GlassCard from '../../../components/GlassCard';
import TurnstileWidget from '../../../components/TurnstileWidget';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaGeneration, setCaptchaGeneration] = useState(0);
  const [captchaError, setCaptchaError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const loginPath = searchParams.get('role') === 'owner'
    ? '/shop-owner/login'
    : '/customer/login';

  const handleRequest = async (event) => {
    event.preventDefault();
    if (!captchaToken) {
      setShowCaptcha(true);
      return;
    }

    setLoading(true);
    setError('');
    try {
      await authAPI.requestPasswordReset({
        email,
        captcha_token: captchaToken,
      });
      setRequestSent(true);
      setShowCaptcha(false);
      setCaptchaToken('');
      setCaptchaGeneration((generation) => generation + 1);
    } catch {
      setError('The request could not be completed. Please try again later.');
      setShowCaptcha(false);
      setCaptchaToken('');
      setCaptchaGeneration((generation) => generation + 1);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (event) => {
    event.preventDefault();
    if (newPassword.length < 10) {
      setError('Password must be at least 10 characters.');
      return;
    }
    if (newPassword !== passwordConfirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await authAPI.confirmPasswordReset({
        email,
        code,
        new_password: newPassword,
        password_confirm: passwordConfirm,
      });
      addToast('Password reset. You can now sign in.', 'success');
      navigate(loginPath, { replace: true });
    } catch (requestError) {
      const passwordErrors = requestError.response?.data?.new_password;
      setError(Array.isArray(passwordErrors) && passwordErrors.length
        ? passwordErrors[0]
        : 'The reset code is invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  const requestAnotherCode = () => {
    setRequestSent(false);
    setShowCaptcha(false);
    setCaptchaToken('');
    setCaptchaGeneration((generation) => generation + 1);
    setCode('');
    setError('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-white">Reset Password</h2>
          <p className="text-slate/80 text-xs">
            Enter your email to request a short-lived reset code.
          </p>
        </div>

        <GlassCard className="bg-charcoal/70 border-charcoal p-8">
          <form onSubmit={requestSent ? handleConfirm : handleRequest} className="space-y-4">
            {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
            <div>
              <label className="text-xs font-medium text-slate/60 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate/80 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  disabled={requestSent}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-charcoal/60 border border-charcoal text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-charcoal/50 disabled:opacity-70"
                />
              </div>
            </div>

            {!requestSent && showCaptcha && (
              <div className="space-y-2">
                <TurnstileWidget
                  key={captchaGeneration}
                  action="password_reset"
                  onToken={(token) => {
                    setCaptchaToken(token);
                    setShowCaptcha(false);
                    setCaptchaError('');
                  }}
                  onError={(message) => {
                    setCaptchaToken('');
                    setShowCaptcha(false);
                    setCaptchaError(message);
                    setCaptchaGeneration((generation) => generation + 1);
                  }}
                />
                {captchaError && <p role="alert" className="text-sm text-red-400">{captchaError}</p>}
              </div>
            )}

            {requestSent && (
              <>
                <p className="text-sm text-slate/80">
                  If the account is eligible, a password reset code will be sent.
                </p>
                <label className="text-xs font-medium text-slate/60 block">
                  6-digit reset code
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    required
                    value={code}
                    onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                    autoComplete="one-time-code"
                    className="mt-1.5 w-full rounded-xl bg-charcoal/60 border border-charcoal px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-charcoal/50"
                  />
                </label>
                <label className="text-xs font-medium text-slate/60 block">
                  New password
                  <Lock className="w-4 h-4 inline ml-2" />
                  <input
                    type="password"
                    required
                    minLength={10}
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    autoComplete="new-password"
                    className="mt-1.5 w-full rounded-xl bg-charcoal/60 border border-charcoal px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-charcoal/50"
                  />
                </label>
                <label className="text-xs font-medium text-slate/60 block">
                  Confirm new password
                  <input
                    type="password"
                    required
                    minLength={10}
                    value={passwordConfirm}
                    onChange={(event) => setPasswordConfirm(event.target.value)}
                    autoComplete="new-password"
                    className="mt-1.5 w-full rounded-xl bg-charcoal/60 border border-charcoal px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-charcoal/50"
                  />
                </label>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-btn-primary py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Please wait…' : requestSent ? 'Reset Password' : 'Send Code'}</span>
            </button>
            {requestSent && (
              <button
                type="button"
                disabled={loading}
                onClick={requestAnotherCode}
                className="w-full py-2 text-sm text-indigo-300 disabled:opacity-60"
              >
                Request another code
              </button>
            )}
          </form>
        </GlassCard>

        <div className="text-center">
          <NavLink to={loginPath} className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300">
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
