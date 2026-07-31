import React, { useState } from 'react';
import { Settings, Moon, Sun, Bell, Shield, DollarSign, Globe, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/NotificationContext';
import GlassCard from '../components/GlassCard';

const SettingsPage = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { addToast } = useToast();
  const [currency, setCurrency] = useState('USD');
  const [lowStockNotification, setLowStockNotification] = useState(true);
  const [soundFeedback, setSoundFeedback] = useState(true);

  const handleSaveSettings = () => {
    addToast('System settings updated successfully!', 'success');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-white">System Settings & Preferences</h1>
        <p className="text-xs text-slate-400 mt-1">Configure ShopGenie AI operational defaults and UI themes.</p>
      </div>

      <GlassCard className="bg-slate-900/70 border-slate-800 p-8 space-y-6 text-xs">
        {/* Theme Settings */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-white text-sm">Interface Appearance</h3>
            <p className="text-slate-400">Switch between dark mode and light theme</p>
          </div>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center gap-2"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            <span>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
          </button>
        </div>

        {/* Currency Selector */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-white text-sm">Default Currency</h3>
            <p className="text-slate-400">Select currency symbol for POS and invoice rendering</p>
          </div>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="INR">INR (₹)</option>
          </select>
        </div>

        {/* Notification Alert Toggle */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-white text-sm">Low Stock Sound & Push Alerts</h3>
            <p className="text-slate-400">Trigger instant alert popup when items cross minimum threshold</p>
          </div>
          <input
            type="checkbox"
            checked={lowStockNotification}
            onChange={(e) => setLowStockNotification(e.target.checked)}
            className="w-5 h-5 accent-indigo-500 cursor-pointer"
          />
        </div>

        <button
          onClick={handleSaveSettings}
          className="gradient-btn-primary px-8 py-3 rounded-xl font-bold text-xs flex items-center gap-2"
        >
          <Check className="w-4 h-4" /> Save Preferences
        </button>
      </GlassCard>
    </div>
  );
};

export default SettingsPage;
