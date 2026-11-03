import React, { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../../services/adminApi';
import ConfirmDialog from '../../components/ConfirmDialog';
import {
  Smartphone,
  Store,
  ShieldAlert,
  Sliders,
  CheckCircle,
  AlertCircle,
  Save,
  RefreshCw,
  ExternalLink,
  Code,
} from 'lucide-react';

const DEFAULT_FLAGS = {
  customer_app: {
    ai_visual_search: true,
    ar_product_preview: false,
    customer_reviews: true,
    live_chat_support: true,
    instant_discounts: true,
    map_view: true,
  },
  owner_app: {
    inventory_alerts: true,
    esp32_cam_scanner: true,
    barcode_scanner: true,
    offline_mode: false,
    advanced_analytics: true,
    worker_pin_login: true,
  },
};

const AppSettingsSection = () => {
  const [selectedApp, setSelectedApp] = useState('customer_app'); // 'customer_app' | 'owner_app'
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Form states
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('');
  const [minSupportedVersion, setMinSupportedVersion] = useState('1.0.0');
  const [featureFlags, setFeatureFlags] = useState({});

  // Public test endpoint preview
  const [publicResponse, setPublicResponse] = useState(null);
  const [testingPublic, setTestingPublic] = useState(false);

  // Confirm dialog
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: '',
    confirmVariant: 'warning',
    action: null,
  });

  const fetchSettings = useCallback(async (appKey) => {
    setLoading(true);
    setError(null);
    setSaveSuccess(false);
    try {
      const res = await adminApi.getAppSettings(appKey);
      const data = res.data;
      setSettings(data);
      setMaintenanceMode(Boolean(data.maintenance_mode));
      setMaintenanceMessage(data.maintenance_message || '');
      setMinSupportedVersion(data.min_supported_version || '1.0.0');

      const mergedFlags = {
        ...(DEFAULT_FLAGS[appKey] || {}),
        ...(data.feature_flags || {}),
      };
      setFeatureFlags(mergedFlags);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load app settings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings(selectedApp);
    setPublicResponse(null);
  }, [selectedApp, fetchSettings]);

  const handleToggleMaintenance = (nextState) => {
    setConfirmConfig({
      isOpen: true,
      title: `${nextState ? 'Activate' : 'Deactivate'} Maintenance Mode for ${
        selectedApp === 'customer_app' ? 'Customer App' : 'Shop Owner App'
      }?`,
      message: nextState
        ? 'Activating maintenance mode will immediately inform all mobile users that the service is unavailable, blocking normal checkout/browsing operations.'
        : 'Deactivating maintenance mode will restore standard operations immediately.',
      confirmText: nextState ? 'Turn On Maintenance' : 'Turn Off Maintenance',
      confirmVariant: nextState ? 'danger' : 'primary',
      action: () => setMaintenanceMode(nextState),
    });
  };

  const handleFlagToggle = (key) => {
    setFeatureFlags((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaveSuccess(false);
    try {
      const payload = {
        maintenance_mode: maintenanceMode,
        maintenance_message: maintenanceMessage,
        min_supported_version: minSupportedVersion,
        feature_flags: featureFlags,
      };
      const res = await adminApi.updateAppSettings(selectedApp, payload);
      setSettings(res.data);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const testPublicEndpoint = async () => {
    setTestingPublic(true);
    try {
      const res = await adminApi.testPublicAppSettings(selectedApp);
      setPublicResponse(res.data);
    } catch (err) {
      setPublicResponse({ error: 'Endpoint call failed', detail: err.message });
    } finally {
      setTestingPublic(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Mobile Apps Configuration & Flags</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time remote kill-switches, maintenance mode, and feature toggles polled by apps.
          </p>
        </div>

        {/* App Switcher Tabs */}
        <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setSelectedApp('customer_app')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-2 ${
              selectedApp === 'customer_app'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Customer App (Flutter)</span>
          </button>
          <button
            onClick={() => setSelectedApp('owner_app')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-2 ${
              selectedApp === 'owner_app'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Owner App (Android)</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-950/40 border border-red-800/60 rounded-xl text-red-300 text-sm flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {saveSuccess && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-emerald-300 text-sm flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-400" />
          <span>Configuration saved successfully to the database.</span>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-slate-500">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-400" />
          <span>Loading remote config...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Controls (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Maintenance Mode Card */}
            <div className={`p-5 rounded-xl border transition-all ${
              maintenanceMode
                ? 'bg-red-950/20 border-red-800/50'
                : 'bg-slate-900 border-slate-800'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2.5 rounded-lg ${
                    maintenanceMode ? 'bg-red-950/60 text-red-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Emergency Maintenance Mode</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Forces client apps to display a maintenance screen on launch.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleMaintenance(!maintenanceMode)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    maintenanceMode ? 'bg-red-600' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                      maintenanceMode ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {maintenanceMode && (
                <div className="mt-4 pt-4 border-t border-red-900/40">
                  <label className="block text-xs font-mono text-red-300 mb-1">
                    MAINTENANCE MESSAGE DISPLAYED TO USERS:
                  </label>
                  <textarea
                    rows="2"
                    value={maintenanceMessage}
                    onChange={(e) => setMaintenanceMessage(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-red-900/50 rounded-lg text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-red-500"
                    placeholder="We are upgrading our servers. Please check back shortly."
                  />
                </div>
              )}
            </div>

            {/* Version Constraint Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-1">Minimum Supported Version</h3>
              <p className="text-xs text-slate-400 mb-3">
                Apps reporting lower semantic versions will prompt users to upgrade.
              </p>
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={minSupportedVersion}
                  onChange={(e) => setMinSupportedVersion(e.target.value)}
                  placeholder="e.g. 1.0.0"
                  className="w-36 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <span className="text-xs text-slate-500 font-mono">SemVer format (MAJOR.MINOR.PATCH)</span>
              </div>
            </div>

            {/* Feature Flags Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center space-x-2">
                  <Sliders className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-semibold text-white">Dynamic Feature Flags</h3>
                </div>
                <span className="text-xs font-mono text-slate-500">Instant toggle without app re-build</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(featureFlags).map(([key, enabled]) => (
                  <div
                    key={key}
                    className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <div className="font-mono text-xs text-slate-200 font-medium">
                        {key.replace(/_/g, ' ')}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">{key}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleFlagToggle(key)}
                      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        enabled ? 'bg-indigo-600' : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                          enabled ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50 cursor-pointer transition-all"
              >
                {saving ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{saving ? 'Publishing Changes...' : 'Save & Publish Configuration'}</span>
              </button>
            </div>
          </div>

          {/* Right Sidebar: Public Endpoint Diagnostics (1 col) */}
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center space-x-2 text-indigo-400 mb-2">
                <Code className="w-4 h-4" />
                <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
                  Public App Endpoint
                </h4>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Mobile applications poll this public endpoint without authentication to check system availability:
              </p>

              <div className="mt-3 p-2.5 bg-slate-950 border border-slate-800 rounded-lg font-mono text-[11px] text-slate-300 break-all select-all">
                GET /api/app-settings/{selectedApp}/
              </div>

              <button
                onClick={testPublicEndpoint}
                disabled={testingPublic}
                className="mt-3 w-full py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testingPublic ? 'animate-spin' : ''}`} />
                <span>Test Live Response</span>
              </button>

              {publicResponse && (
                <div className="mt-4">
                  <div className="text-[10px] font-mono text-slate-500 mb-1">
                    LIVE RESPONSE BODY:
                  </div>
                  <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-[10px] font-mono text-emerald-400 overflow-x-auto max-h-60">
                    {JSON.stringify(publicResponse, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-4 text-[11px] text-slate-500 space-y-2">
              <div className="font-semibold text-slate-400">Security Architecture Note:</div>
              <p>
                The public endpoint is strictly read-only and cached. Only authenticated developer sessions via <code className="text-slate-400">/api/admin/app-settings/</code> can alter feature states.
              </p>
              {settings?.updated_at && (
                <div className="pt-2 border-t border-slate-800/80 font-mono text-[10px]">
                  Last updated by: {settings.updated_by || 'system'}<br />
                  Time: {new Date(settings.updated_at).toLocaleString()}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={confirmConfig.confirmText}
        confirmVariant={confirmConfig.confirmVariant}
        onConfirm={() => {
          if (confirmConfig.action) confirmConfig.action();
          setConfirmConfig({ ...confirmConfig, isOpen: false });
        }}
        onCancel={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
      />
    </div>
  );
};

export default AppSettingsSection;
