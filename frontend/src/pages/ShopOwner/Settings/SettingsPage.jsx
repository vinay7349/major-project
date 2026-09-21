import React, { useState } from 'react';
import { Settings, Moon, Sun, Bell, Shield, DollarSign, Globe, Check, Save } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { useToast } from '../../../context/NotificationContext';
import GlassCard from '../../../components/GlassCard';

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
        <h1 className="text-3xl font-extrabold tracking-tight text-navy dark:text-white">
          System Settings
        </h1>
        <p className="text-slate/60 dark:text-slate/60 text-xs mt-1">
          Configure ShopGenie operational defaults and UI preferences
        </p>
      </div>

      <GlassCard className="p-6 space-y-6">
        {/* Theme Settings */}
        <div className="flex justify-between items-center pb-4 border-b border-warmwhite/60 dark:border-charcoal">
          <div>
            <h3 className="font-bold text-navy dark:text-white text-sm">Interface Appearance</h3>
            <p className="text-xs text-slate/60 dark:text-slate/60">Switch between dark mode and light theme</p>
          </div>
          <button
            onClick={toggleTheme}
            className="px-4 py-2.5 rounded-xl bg-warmwhite dark:bg-charcoal border border-warmwhite/60 dark:border-charcoal text-sm font-bold text-navy dark:text-white flex items-center gap-2 hover:bg-warmwhite/80 dark:hover:bg-charcoal/80 transition-all"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber" /> : <Moon className="w-4 h-4 text-amber" />}
            <span>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
          </button>
        </div>

        {/* Currency Selector */}
        <div className="flex justify-between items-center pb-4 border-b border-warmwhite/60 dark:border-charcoal">
          <div>
            <h3 className="font-bold text-navy dark:text-white text-sm">Default Currency</h3>
            <p className="text-xs text-slate/60 dark:text-slate/60">Select currency symbol for POS and invoice rendering</p>
          </div>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-warmwhite dark:bg-charcoal border border-warmwhite/60 dark:border-charcoal text-sm text-navy dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber/20"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="INR">INR (₹)</option>
          </select>
        </div>

        {/* Notification Alert Toggle */}
        <div className="flex justify-between items-center pb-4 border-b border-warmwhite/60 dark:border-charcoal">
          <div>
            <h3 className="font-bold text-navy dark:text-white text-sm">Low Stock Sound & Push Alerts</h3>
            <p className="text-xs text-slate/60 dark:text-slate/60">Trigger instant alert popup when items cross minimum threshold</p>
          </div>
          <input
            type="checkbox"
            checked={lowStockNotification}
            onChange={(e) => setLowStockNotification(e.target.checked)}
            className="w-5 h-5 accent-amber cursor-pointer"
          />
        </div>

        {/* Sound Feedback Toggle */}
        <div className="flex justify-between items-center pb-4 border-b border-warmwhite/60 dark:border-charcoal">
          <div>
            <h3 className="font-bold text-navy dark:text-white text-sm">Sound Feedback</h3>
            <p className="text-xs text-slate/60 dark:text-slate/60">Enable sound effects for POS operations</p>
          </div>
          <input
            type="checkbox"
            checked={soundFeedback}
            onChange={(e) => setSoundFeedback(e.target.checked)}
            className="w-5 h-5 accent-amber cursor-pointer"
          />
        </div>

        <button
          onClick={handleSaveSettings}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber text-white text-sm font-bold hover:bg-amber/90 transition-all"
        >
          <Save className="w-4 h-4" /> Save Preferences
        </button>
      </GlassCard>
    </div>
  );
};

export default SettingsPage;