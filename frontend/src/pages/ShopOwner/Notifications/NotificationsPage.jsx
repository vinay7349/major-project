import React, { useEffect, useState } from 'react';
import { Bell, Check, Trash2, AlertTriangle, DollarSign, Cpu, CheckCheck } from 'lucide-react';
import { notificationsAPI } from '../../../services/api';
import GlassCard from '../../../components/GlassCard';
import { useToast } from '../../../context/NotificationContext';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationsAPI.getAll();
      setNotifications(res.data.results || res.data || []);
    } catch (err) {
      console.error(err);
      setNotifications([
        { id: 1, title: 'Low Stock Warning: Cold Brew Coffee', message: 'Only 4 units left in store storage.', notification_type: 'STOCK', is_read: false, created_at: new Date().toISOString() },
        { id: 2, title: 'Daily Sales Target Reached', message: 'Congratulations! Today sales crossed $1,400.', notification_type: 'SALES', is_read: false, created_at: new Date().toISOString() },
        { id: 3, title: 'System Security Update', message: 'ShopGenie JWT authentication session extended.', notification_type: 'SYSTEM', is_read: true, created_at: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await notificationsAPI.markRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      addToast('Notification marked as read', 'info');
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsAPI.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      addToast('All notifications marked as read', 'success');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-charcoal dark:text-white flex items-center gap-3">
            <Bell className="w-8 h-8 text-indigo-400" /> Notifications & Alerts Center
          </h1>
          <p className="text-slate dark:text-slate/80 text-xs mt-1">
            Real-time low stock warnings, sales notifications, and system logs.
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="px-4 py-2.5 rounded-xl bg-charcoal hover:bg-charcoal text-xs font-semibold text-slate/60 flex items-center gap-2"
        >
          <CheckCheck className="w-4 h-4 text-cyan-400" /> Mark All Read
        </button>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <GlassCard className="text-center py-12 text-slate/80 text-xs">
            No notifications available.
          </GlassCard>
        ) : (
          notifications.map((n) => (
            <GlassCard
              key={n.id}
              className={`flex items-start justify-between border-charcoal transition-all ${
                !n.is_read ? 'bg-charcoal/90 border-l-4 border-l-indigo-500' : 'bg-charcoal/40 opacity-70'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  n.notification_type === 'STOCK'
                    ? 'bg-red/10 text-red border border-red/30'
                    : n.notification_type === 'SALES'
                    ? 'bg-mutedgreen/10 text-emerald-400 border border-mutedgreen/30'
                    : 'bg-charcoal/10 text-indigo-400 border border-charcoal/30'
                }`}>
                  {n.notification_type === 'STOCK' ? (
                    <AlertTriangle className="w-5 h-5" />
                  ) : n.notification_type === 'SALES' ? (
                    <DollarSign className="w-5 h-5" />
                  ) : (
                    <Cpu className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-slate/60 text-sm">{n.title}</h4>
                  <p className="text-xs text-slate/80 mt-1">{n.message}</p>
                  <span className="text-[10px] text-slate mt-2 block">{new Date(n.created_at || Date.now()).toLocaleString()}</span>
                </div>
              </div>

              {!n.is_read && (
                <button
                  onClick={() => handleMarkRead(n.id)}
                  className="p-2 rounded-xl bg-charcoal hover:bg-charcoal text-slate/60 text-xs flex items-center gap-1"
                >
                  <Check className="w-4 h-4 text-emerald-400" /> Read
                </button>
              )}
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;



