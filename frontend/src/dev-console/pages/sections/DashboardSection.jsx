import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';
import {
  Store,
  Users,
  Package,
  Tag,
  Receipt,
  Database,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  Server,
  Zap,
} from 'lucide-react';

const DashboardSection = ({ onNavigate }) => {
  const { info, error: toastError } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async (silent = false) => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.getDashboard();
      setData(res.data);
      if (silent) {
        info('Metrics refreshed from datastore');
      }
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to fetch dashboard metrics.';
      setError(msg);
      toastError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-slate-400">
        {loading ? (
          <>
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium">Loading database metrics...</span>
          </>
        ) : (
          <>
            <AlertTriangle className="w-8 h-8 text-rose-400" />
            <span className="text-sm text-rose-300">
              {error || 'Dashboard data is unavailable.'}
            </span>
            <button
              onClick={() => fetchDashboard()}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg"
            >
              Retry
            </button>
          </>
        )}
      </div>
    );
  }

  const pendingModeration = data?.shops?.draft || 0;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2.5">
            <span>System Telemetry & Health</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Operational
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Live totals from the configured database across the Customer and Shop Owner apps.
          </p>
        </div>
        <button
          onClick={() => fetchDashboard(true)}
          disabled={loading}
          className="inline-flex items-center space-x-2 px-3.5 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700/80 transition-all self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-800/60 rounded-xl text-rose-300 text-xs flex items-center space-x-3">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Moderation Alert Banner if shops are in Draft */}
      {pendingModeration > 0 && (
        <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg shrink-0">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-amber-200">
                {pendingModeration} {pendingModeration === 1 ? 'Shop' : 'Shops'} in Draft Queue
              </div>
              <div className="text-xs text-amber-400/80 mt-0.5">
                New merchant registrations or unpublished shops require review before going live.
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('shops')}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold text-xs rounded-lg transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
          >
            Review Queue
          </button>
        </div>
      )}

      {/* Primary Datastore Connection Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className={`p-3 rounded-xl ${
            data?.database?.healthy ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40' : 'bg-rose-950/60 text-rose-400 border border-rose-800/40'
          }`}>
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white flex items-center gap-2">
              <span>Database Connection:</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                data?.database?.healthy ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}>
                {data?.database?.healthy ? 'Connected & Healthy' : 'Degraded Connection'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {data?.database?.healthy ? 'Database is responding to queries.' : data?.database?.error}
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('health')}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1.5 self-start sm:self-auto py-1 px-2.5 rounded-lg hover:bg-indigo-950/40 transition-colors cursor-pointer"
        >
          <span>Run Latency Probe</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Primary 3-Column Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Shops Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-slate-700/80 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                  <Store className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-slate-200">Shops Ecosystem</span>
              </div>
              <button
                onClick={() => onNavigate('shops')}
                className="text-xs text-slate-400 hover:text-indigo-400 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Manage</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-bold text-white tracking-tight">{data?.shops?.total || 0}</span>
              <span className="text-xs text-slate-400">Total registered</span>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/60 text-center">
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/50">
              <div className="text-sm text-emerald-400 font-bold">{data?.shops?.published || 0}</div>
              <div className="text-xs text-slate-400 mt-0.5">Live</div>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/50">
              <div className="text-sm text-amber-400 font-bold">{data?.shops?.draft || 0}</div>
              <div className="text-xs text-slate-400 mt-0.5">Draft</div>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/50">
              <div className="text-sm text-rose-400 font-bold">{data?.shops?.suspended || 0}</div>
              <div className="text-xs text-slate-400 mt-0.5">Suspended</div>
            </div>
          </div>
        </div>

        {/* Users Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-slate-700/80 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-sky-500/10 text-sky-400 rounded-lg">
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-slate-200">Accounts & Roles</span>
              </div>
              <button
                onClick={() => onNavigate('users')}
                className="text-xs text-slate-400 hover:text-sky-400 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Manage</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-bold text-white tracking-tight">
                {(data?.users?.owners || 0) +
                  (data?.users?.workers || 0) +
                  (data?.users?.customers || 0) +
                  (data?.users?.developers || 0)}
              </span>
              <span className="text-xs text-slate-400">Total accounts</span>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/60 text-center">
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/50">
              <div className="text-sm text-sky-400 font-bold">{data?.users?.owners || 0}</div>
              <div className="text-xs text-slate-400 mt-0.5">Owners</div>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/50">
              <div className="text-sm text-purple-400 font-bold">{data?.users?.workers || 0}</div>
              <div className="text-xs text-slate-400 mt-0.5">Workers</div>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/50">
              <div className="text-sm text-emerald-400 font-bold">{data?.users?.customers || 0}</div>
              <div className="text-xs text-slate-400 mt-0.5">Customers</div>
            </div>
          </div>
        </div>

        {/* Products Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-slate-700/80 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                  <Package className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-slate-200">Catalog Inventory</span>
              </div>
              <button
                onClick={() => onNavigate('products')}
                className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Manage</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-bold text-white tracking-tight">{data?.products?.total || 0}</span>
              <span className="text-xs text-slate-400">Total catalog SKUs</span>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/60 text-center">
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/50">
              <div className="text-sm text-emerald-400 font-bold">{data?.products?.published || 0}</div>
              <div className="text-xs text-slate-400 mt-0.5">Active</div>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/50">
              <div className="text-sm text-amber-400 font-bold">{data?.products?.draft || 0}</div>
              <div className="text-xs text-slate-400 mt-0.5">Draft</div>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/50">
              <div className="text-sm text-slate-400 font-bold">{data?.products?.archived || 0}</div>
              <div className="text-xs text-slate-400 mt-0.5">Archived</div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center space-x-4">
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-white">{data?.offers?.active || 0}</div>
            <div className="text-xs text-slate-400">Active Offers ({data?.offers?.total || 0} total)</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center space-x-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-white">{data?.invoices || 0}</div>
            <div className="text-xs text-slate-400">Total Invoices Processed</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center space-x-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-white">{data?.users?.developers || 0}</div>
            <div className="text-xs text-slate-400">CLI Developers Provisioned</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSection;
