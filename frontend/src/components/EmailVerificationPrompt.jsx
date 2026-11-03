import React, { useState } from 'react';
import { authAPI } from '../services/api';

const EmailVerificationPrompt = ({ initialEmail = '' }) => {
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [message, setMessage] = useState('');

  const verify = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await authAPI.verifyEmail({ email, code });
      setVerified(true);
      setMessage('Email verified. You can now sign in.');
    } catch {
      setMessage('The verification code is invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    setLoading(true);
    setMessage('');
    try {
      await authAPI.resendVerification({ email });
      setMessage('If the account is eligible, a verification code will be sent.');
    } catch {
      setMessage('The request could not be completed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-5 rounded-2xl border border-border dark:border-border-dark bg-surface/70 dark:bg-surface-dark/70 p-5">
      <h3 className="text-sm font-bold text-text-primary dark:text-text-dark">
        Verify your email
      </h3>
      {message && (
        <p role={verified ? 'status' : 'alert'} className="mt-2 text-xs text-text-muted dark:text-text-mutedDark">
          {message}
        </p>
      )}
      {!verified && (
        <form onSubmit={verify} className="mt-3 space-y-3">
          <label className="block text-xs font-medium text-text-muted dark:text-text-mutedDark">
            Email address
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              className="mt-1.5 h-11 w-full rounded-input border border-border dark:border-border-dark bg-background dark:bg-background-dark px-3 text-sm text-text-primary dark:text-text-dark"
            />
          </label>
          <label className="block text-xs font-medium text-text-muted dark:text-text-mutedDark">
            6-digit code
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              required
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
              autoComplete="one-time-code"
              className="mt-1.5 h-11 w-full rounded-input border border-border dark:border-border-dark bg-background dark:bg-background-dark px-3 text-sm text-text-primary dark:text-text-dark"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <button type="submit" disabled={loading} className="h-10 rounded-button btn-primary px-4 text-xs font-bold text-white disabled:opacity-50">
              Verify email
            </button>
            <button type="button" disabled={loading} onClick={resend} className="h-10 rounded-button border border-border px-4 text-xs font-semibold disabled:opacity-50">
              Resend code
            </button>
          </div>
        </form>
      )}
    </section>
  );
};

export default EmailVerificationPrompt;
