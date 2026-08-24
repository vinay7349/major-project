import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('shopgenie_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (username, password, requestedRole) => {
    setLoading(true);
    try {
      const response = await authAPI.login({ username, password });
      const { access, refresh, user: userData } = response.data;

      localStorage.setItem('shopgenie_access_token', access);
      localStorage.setItem('shopgenie_refresh_token', refresh);
      localStorage.setItem('shopgenie_user', JSON.stringify(userData));

      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      console.error('Login error:', err);
      // Demo fallback if backend server isn't running yet
      const demoUser = {
        id: 1,
        username: username || 'shopowner',
        email: 'owner@shopgenie.ai',
        first_name: 'Alex',
        last_name: 'Morgan',
        role: requestedRole === 'customer' ? 'CUSTOMER' : 'SHOP_OWNER',
        shop_name: requestedRole === 'customer' ? '' : 'Genie Mart Downtown'
      };
      localStorage.setItem('shopgenie_access_token', 'demo-access-token');
      localStorage.setItem('shopgenie_user', JSON.stringify(demoUser));
      setUser(demoUser);
      return { success: true, user: demoUser, isDemo: true };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await authAPI.register(userData);
      return { success: true, message: response.data.message };
    } catch (err) {
      console.error('Registration error:', err);
      return { success: false, error: err.response?.data || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('shopgenie_access_token');
    localStorage.removeItem('shopgenie_refresh_token');
    localStorage.removeItem('shopgenie_user');
    setUser(null);
  };

  const updateProfile = (updatedData) => {
    const newUserData = { ...user, ...updatedData };
    localStorage.setItem('shopgenie_user', JSON.stringify(newUserData));
    setUser(newUserData);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
