import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { adminApi } from '../services/adminApi';

const DevAuthContext = createContext(null);

const configuredSessionMinutes = Number.parseInt(
  import.meta.env.VITE_ADMIN_SESSION_MINUTES || '30',
  10
);
export const ADMIN_SESSION_MINUTES =
  Number.isFinite(configuredSessionMinutes) && configuredSessionMinutes > 0
    ? configuredSessionMinutes
    : 30;
const IDLE_TIMEOUT_MS = ADMIN_SESSION_MINUTES * 60 * 1000;

export const DevAuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('shopgenie_dev_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);
  const [sessionExpiryTime, setSessionExpiryTime] = useState(() => Date.now() + IDLE_TIMEOUT_MS);
  const idleTimerRef = useRef(null);

  const logout = useCallback(() => {
    sessionStorage.removeItem('shopgenie_dev_access_token');
    sessionStorage.removeItem('shopgenie_dev_refresh_token');
    sessionStorage.removeItem('shopgenie_dev_user');
    setUser(null);
  }, []);

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    const nextExpiry = Date.now() + IDLE_TIMEOUT_MS;
    setSessionExpiryTime(nextExpiry);

    idleTimerRef.current = setTimeout(() => {
      console.warn('Developer console session timed out due to inactivity.');
      logout();
    }, IDLE_TIMEOUT_MS);
  }, [logout]);

  // Activity listeners for idle timeout
  useEffect(() => {
    if (!user) return;

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    const handleActivity = () => resetIdleTimer();

    events.forEach((evt) => window.addEventListener(evt, handleActivity));
    resetIdleTimer();

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, handleActivity));
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [user, resetIdleTimer]);

  // Listen for unauthorized 401 events from adminApi
  useEffect(() => {
    const handleExpired = () => {
      setUser(null);
    };
    window.addEventListener('dev-auth-expired', handleExpired);
    return () => window.removeEventListener('dev-auth-expired', handleExpired);
  }, []);

  // Validate session on mount with backend DB lookup
  useEffect(() => {
    const token = sessionStorage.getItem('shopgenie_dev_access_token');
    if (!token) {
      setLoading(false);
      return;
    }

    adminApi
      .getMe()
      .then((res) => {
        if (res.data?.role === 'DEVELOPER') {
          setUser(res.data);
          sessionStorage.setItem('shopgenie_dev_user', JSON.stringify(res.data));
        } else {
          logout();
        }
      })
      .catch(() => {
        logout();
      })
      .finally(() => {
        setLoading(false);
      });
  }, [logout]);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await adminApi.login(username, password);
      const { access, refresh, user: devUser } = response.data;

      sessionStorage.setItem('shopgenie_dev_access_token', access);
      sessionStorage.setItem('shopgenie_dev_refresh_token', refresh);
      sessionStorage.setItem('shopgenie_dev_user', JSON.stringify(devUser));

      setUser(devUser);
      resetIdleTimer();
      return { success: true, user: devUser };
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        (err.response?.status === 429
          ? 'Too many login attempts. Please wait before trying again.'
          : 'Developer authentication failed.');
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  return (
    <DevAuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user && user.role === 'DEVELOPER',
        sessionExpiryTime,
      }}
    >
      {children}
    </DevAuthContext.Provider>
  );
};

export const useDevAuth = () => {
  const ctx = useContext(DevAuthContext);
  if (!ctx) {
    throw new Error('useDevAuth must be used within a DevAuthProvider');
  }
  return ctx;
};

export default DevAuthContext;
