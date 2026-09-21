import React, { useState, useEffect } from 'react';
import { Smartphone, Wifi, Clock, CheckCircle, XCircle, RefreshCw, QrCode, Scan, Link, Unlink, AlertCircle, Info } from 'lucide-react';
import { useToast } from '../../../context/NotificationContext';

const AppConnectionPage = () => {
  const { addToast } = useToast();
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [lastSync, setLastSync] = useState('2024-01-15 14:30:25');
  const [syncInterval, setSyncInterval] = useState(300);
  const [shopName, setShopName] = useState('Genie Mart Downtown');
  const [connectedDevice, setConnectedDevice] = useState('iPhone 15 Pro');
  const [syncLogs, setSyncLogs] = useState([
    { id: 1, type: 'success', message: 'Products synced successfully', time: '2 min ago' },
    { id: 2, type: 'success', message: 'Inventory updated', time: '5 min ago' },
    { id: 3, type: 'warning', message: '3 products pending sync', time: '10 min ago' },
    { id: 4, type: 'info', message: 'Connection established', time: '1 hour ago' },
  ]);

  const handleSync = async () => {
    addToast('Syncing data...', 'info');
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLastSync(new Date().toLocaleString());
    setSyncLogs(prev => [
      { id: Date.now(), type: 'success', message: 'Full sync completed', time: 'Just now' },
      ...prev.slice(0, 4),
    ]);
    addToast('Data synced successfully!', 'success');
  };

  const handleConnectApp = () => {
    setConnectionStatus('connecting');
    addToast('Connecting to mobile app...', 'info');
    setTimeout(() => {
      setConnectionStatus('connected');
      setConnectedDevice('iPhone 15 Pro');
      addToast('Mobile app connected successfully!', 'success');
    }, 2000);
  };

  const handleDisconnectApp = () => {
    setConnectionStatus('disconnected');
    setConnectedDevice(null);
    addToast('Mobile app disconnected.', 'info');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-navy dark:text-white">
          App Connection
        </h1>
        <p className="text-slate/60 dark:text-slate/60 text-xs mt-1">
          Manage your mobile app connection and sync settings
        </p>
      </div>

      {/* Connection Status Card */}
      <GlassCard className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
              connectionStatus === 'connected'
                ? 'bg-mutedgreen/10 border border-mutedgreen/30'
                : connectionStatus === 'connecting'
                ? 'bg-amber/10 border border-amber/30'
                : 'bg-red/10 border border-red/30'
            }`}>
              {connectionStatus === 'connected' ? (
                <Wifi className="w-8 h-8 text-mutedgreen" />
              ) : connectionStatus === 'connecting' ? (
                <RefreshCw className="w-8 h-8 text-amber animate-spin" />
              ) : (
                <XCircle className="w-8 h-8 text-red" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-navy dark:text-white">
                {connectionStatus === 'connected' ? 'Connected' : connectionStatus === 'connecting' ? 'Connecting...' : 'Not Connected'}
              </h2>
              <p className="text-sm text-slate/60 dark:text-slate/60">
                {connectionStatus === 'connected'
                  ? 'Your mobile app is synced with the dashboard'
                  : connectionStatus === 'connecting'
                  ? 'Establishing connection with mobile app'
                  : 'No active connection to mobile app'}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            {connectionStatus === 'connected' ? (
              <button
                onClick={handleDisconnectApp}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red/10 text-red text-sm font-semibold hover:bg-red/20 transition-all"
              >
                <Unlink className="w-4 h-4" /> Disconnect
              </button>
            ) : (
              <button
                onClick={handleConnectApp}
                disabled={connectionStatus === 'connecting'}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber text-white text-sm font-semibold hover:bg-amber/90 transition-all disabled:opacity-60"
              >
                <Link className="w-4 h-4" /> Connect App
              </button>
            )}
          </div>
        </div>

        {/* Connection Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-warmwhite/60 dark:bg-charcoal/60 border border-warmwhite/60 dark:border-charcoal">
            <p className="text-xs text-slate/60 dark:text-slate/60">Connected Shop</p>
            <p className="text-sm font-bold text-navy dark:text-white mt-1">{shopName}</p>
          </div>
          <div className="p-4 rounded-xl bg-warmwhite/60 dark:bg-charcoal/60 border border-warmwhite/60 dark:border-charcoal">
            <p className="text-xs text-slate/60 dark:text-slate/60">Connected Device</p>
            <p className="text-sm font-bold text-navy dark:text-white mt-1">{connectedDevice || 'None'}</p>
          </div>
          <div className="p-4 rounded-xl bg-warmwhite/60 dark:bg-charcoal/60 border border-warmwhite/60 dark:border-charcoal">
            <p className="text-xs text-slate/60 dark:text-slate/60">Last Sync</p>
            <p className="text-sm font-bold text-navy dark:text-white mt-1 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {lastSync}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-warmwhite/60 dark:bg-charcoal/60 border border-warmwhite/60 dark:border-charcoal">
            <p className="text-xs text-slate/60 dark:text-slate/60">Sync Interval</p>
            <p className="text-sm font-bold text-navy dark:text-white mt-1">{syncInterval} seconds</p>
          </div>
        </div>

        {/* Sync Button */}
        <button
          onClick={handleSync}
          disabled={connectionStatus !== 'connected'}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber text-white text-sm font-semibold hover:bg-amber/90 transition-all disabled:opacity-60"
        >
          <RefreshCw className={`w-4 h-4 ${connectionStatus === 'connected' ? '' : 'animate-spin'}`} />
          {connectionStatus === 'connected' ? 'Sync Now' : 'Connecting...'}
        </button>
      </GlassCard>

      {/* Sync Status by Data Type */}
      <GlassCard className="p-6 space-y-4">
        <h3 className="text-lg font-bold text-navy dark:text-white">Sync Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'Products', synced: 145, pending: 3, icon: Package },
            { name: 'Inventory', synced: 142, pending: 5, icon: AlertTriangle },
            { name: 'Orders', synced: 89, pending: 2, icon: ShoppingBag },
            { name: 'Customers', synced: 56, pending: 0, icon: Users },
          ].map((item) => (
            <div key={item.name} className="flex items-center justify-between p-4 rounded-xl bg-warmwhite/60 dark:bg-charcoal/60 border border-warmwhite/60 dark:border-charcoal">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  item.pending > 0 ? 'bg-amber/10' : 'bg-mutedgreen/10'
                }`}>
                  <item.icon className="w-5 h-5 text-amber" />
                </div>
                <div>
                  <p className="text-sm font-bold text-navy dark:text-white capitalize">{item.name}</p>
                  <p className="text-xs text-slate/60 dark:text-slate/60">
                    {item.synced} synced, {item.pending} pending
                  </p>
                </div>
              </div>
              {item.pending > 0 && (
                <span className="px-2 py-1 rounded-full bg-amber/10 text-amber text-xs font-semibold">
                  {item.pending} pending
                </span>
              )}
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Sync Logs */}
      <GlassCard className="p-6 space-y-4">
        <h3 className="text-lg font-bold text-navy dark:text-white">Sync Logs</h3>
        <div className="space-y-3">
          {syncLogs.map((log) => (
            <div key={log.id} className="flex items-center gap-3 p-3 rounded-xl bg-warmwhite/60 dark:bg-charcoal/60 border border-warmwhite/60 dark:border-charcoal">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                log.type === 'success'
                  ? 'bg-mutedgreen/10 text-mutedgreen'
                  : log.type === 'warning'
                  ? 'bg-amber/10 text-amber'
                  : 'bg-amber/10 text-amber'
              }`}>
                {log.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <Info className="w-4 h-4" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-navy dark:text-white">{log.message}</p>
                <p className="text-xs text-slate/60 dark:text-slate/60">{log.time}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* QR Code for App Connection */}
      <GlassCard className="p-6 space-y-4">
        <h3 className="text-lg font-bold text-navy dark:text-white">Connect via QR Code</h3>
        <p className="text-sm text-slate/60 dark:text-slate/60">
          Scan this QR code with your mobile app to connect
        </p>
        <div className="flex justify-center p-8 bg-warmwhite/60 dark:bg-charcoal/60 rounded-2xl border border-warmwhite/60 dark:border-charcoal">
          <div className="w-48 h-48 bg-white rounded-xl flex items-center justify-center">
            <QrCode className="w-32 h-32 text-navy" />
          </div>
        </div>
        <p className="text-xs text-slate/60 dark:text-slate/60 text-center">
          QR code expires in 5 minutes
        </p>
      </GlassCard>
    </div>
  );
};

export default AppConnectionPage;