import React, { useState, useEffect } from 'react';
import { RefreshCw, Clock, CheckCircle, AlertCircle, Info, Download, Package, AlertTriangle } from 'lucide-react';
import { useToast } from '../../../context/NotificationContext';

const UpdatesPage = () => {
  const { addToast } = useToast();
  const [updates, setUpdates] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setUpdates([
      {
        id: 1,
        type: 'info',
        title: 'Product Catalog Updated',
        description: '15 new products added to your catalog this week.',
        time: '2 hours ago',
        read: false
      },
      {
        id: 2,
        type: 'warning',
        title: 'Low Stock Alert',
        description: '3 products are below minimum stock level. Consider restocking.',
        time: '5 hours ago',
        read: false
      },
      {
        id: 3,
        type: 'success',
        title: 'Inventory Synced',
        description: 'Your inventory has been successfully synced with the mobile app.',
        time: '1 day ago',
        read: true
      },
      {
        id: 4,
        type: 'info',
        title: 'New Order Received',
        description: 'Order #ORD-045 has been placed. Total: $89.99',
        time: '1 day ago',
        read: true
      },
      {
        id: 5,
        type: 'success',
        title: 'Shop Profile Updated',
        description: 'Your shop profile has been updated successfully.',
        time: '2 days ago',
        read: true
      },
      {
        id: 6,
        type: 'warning',
        title: 'Payment Pending',
        description: 'Payment for order #ORD-038 is pending. Amount: $45.50',
        time: '3 days ago',
        read: true
      }
    ]);
  }, []);

  const handleMarkRead = (id) => {
    setUpdates(prev => prev.map(u => u.id === id ? { ...u, read: true } : u));
    addToast('Marked as read', 'success');
  };

  const handleMarkAllRead = () => {
    setUpdates(prev => prev.map(u => ({ ...u, read: true })));
    addToast('All updates marked as read', 'success');
  };

  const filteredUpdates = filter === 'all'
    ? updates
    : updates.filter(u => u.type === filter);

  const unreadCount = updates.filter(u => !u.read).length;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-navy dark:text-white">
            Updates
          </h1>
          <p className="text-slate/60 dark:text-slate/60 text-xs mt-1">
            Stay updated with your shop activity
          </p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <span className="px-3 py-1 rounded-full bg-amber/10 border border-amber/30 text-amber text-xs font-semibold">
              {unreadCount} unread
            </span>
          )}
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-warmwhite dark:bg-charcoal border border-warmwhite/60 dark:border-charcoal text-sm font-semibold text-navy dark:text-white hover:bg-warmwhite/80 dark:hover:bg-charcoal/80 transition-all"
          >
            <CheckCircle className="w-4 h-4" /> Mark All Read
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {['all', 'info', 'warning', 'success'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
              filter === f
                ? 'bg-amber text-white'
                : 'bg-warmwhite dark:bg-charcoal text-slate/60 dark:text-slate/60 hover:bg-warmwhite/80 dark:hover:bg-charcoal/80'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Updates List */}
      <div className="space-y-4">
        {filteredUpdates.map((update) => (
          <GlassCard
            key={update.id}
            className={`p-4 space-y-3 transition-all ${
              !update.read ? 'border-amber/30 bg-amber/5' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                update.type === 'success'
                  ? 'bg-mutedgreen/10 text-mutedgreen'
                  : update.type === 'warning'
                  ? 'bg-amber/10 text-amber'
                  : update.type === 'info'
                  ? 'bg-amber/10 text-amber'
                  : 'bg-warmwhite dark:bg-charcoal text-slate/60'
              }`}>
                {update.type === 'success' && <CheckCircle className="w-5 h-5" />}
                {update.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
                {update.type === 'info' && <Info className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-navy dark:text-white">{update.title}</h3>
                  {!update.read && (
                    <span className="w-2 h-2 rounded-full bg-amber flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate/60 dark:text-slate/60 mt-1">{update.description}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-slate/60 dark:text-slate/60 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {update.time}
                  </span>
                  {!update.read && (
                    <button
                      onClick={() => handleMarkRead(update.id)}
                      className="text-xs text-amber hover:underline"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {filteredUpdates.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle className="w-12 h-12 text-mutedgreen mx-auto mb-3" />
          <p className="text-sm text-slate/60 dark:text-slate/60">No updates found</p>
        </div>
      )}
    </div>
  );
};

export default UpdatesPage;