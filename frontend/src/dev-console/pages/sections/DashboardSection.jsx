import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/adminApi';
import {
  Store,
  Users,
  Package,
  Tag,
  Receipt,
  Database,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';

const DashboardSection = ({ onNavigate }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.getDashboard();
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400">
        <RefreshCw className="w-6 h-6 animate-spin mr-3 text-indigo-400" />
        <span>Loading unified telemetry...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>System Telemetry & Overview</span>
            <span className="px-2 py-0.5 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full font-mono">
              LIVE
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time status across Customer app, Shop Owner app, and PostgreSQL data store.
          </p>
        </div>
        <button
          onClick={fetchDashboard}
          disabled={loading}
          className="inline-flex items-center space-x-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-950/40 border border-red-800/60 rounded-xl text-red-300 text-sm flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Database Health Pill */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2.5 rounded-lg ${
            data?.database?.healthy ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40' : 'bg-red-950/60 text-red-400 border border-red-800/40'
          }`}>
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white flex items-center gap-2">
              <span>PostgreSQL Connection:</span>
              <span className={`text-xs font-mono font-medium px-2 py-0.5 rounded ${
                data?.database?.healthy ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {data?.database?.healthy ? 'ONLINE & READY' : 'DEGRADED / ERROR'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {data?.database?.healthy ? 'All database tables responding to query pool' : data?.database?.error}
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('health')}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 cursor-pointer"
        >
          <span>Run Diagnostics</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Shops Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                <Store className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold text-slate-200">Shops Ecosystem</span>
            </div>
            <button
              onClick={() => onNavigate('shops')}
              className="text-xs text-slate-400 hover:text-indigo-400 flex items-center gap-0.5 cursor-pointer"
            >
              <span>Manage</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-white tracking-tight">{data?.shops?.total || 0}</span>
            <span className="text-xs font-mono text-slate-400">Total registered</span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/60 text-center">
            <div className="bg-slate-950/50 p-2 rounded-lg">
              <div className="text-xs text-emerald-400 font-semibold">{data?.shops?.published || 0}</div>
              <div className="text-[10px] text-slate-500 uppercase mt-0.5">Published</div>
            </div>
            <div className="bg-slate-950/50 p-2 rounded-lg">
              <div className="text-xs text-amber-400 font-semibold">{data?.shops?.draft || 0}</div>
              <div className="text-[10px] text-slate-500 uppercase mt-0.5">Draft</div>
            </div>
            <div className="bg-slate-950/50 p-2 rounded-lg">
              <div className="text-xs text-red-400 font-semibold">{data?.shops?.suspended || 0}</div>
              <div className="text-[10px] text-slate-500 uppercase mt-0.5">Suspended</div>
            </div>
          </div>
        </div>

        {/* Users Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-sky-500/10 text-sky-400 rounded-lg">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold text-slate-200">Accounts by Role</span>
            </div>
            <button
              onClick={() => onNavigate('users')}
              className="text-xs text-slate-400 hover:text-sky-400 flex items-center gap-0.5 cursor-pointer"
            >
              <span>Manage</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-white tracking-tight">
              {(data?.users?.owners || 0) + (data?.users?.workers || 0) + (data?.users?.customers || 0)}
            </span>
            <span className="text-xs font-mono text-slate-400">Total active users</span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/60 text-center">
            <div className="bg-slate-950/50 p-2 rounded-lg">
              <div className="text-xs text-sky-400 font-semibold">{data?.users?.owners || 0}</div>
              <div className="text-[10px] text-slate-500 uppercase mt-0.5">Owners</div>
            </div>
            <div className="bg-slate-950/50 p-2 rounded-lg">
              <div className="text-xs text-purple-400 font-semibold">{data?.users?.workers || 0}</div>
              <div className="text-[10px] text-slate-500 uppercase mt-0.5">Workers</div>
            </div>
            <div className="bg-slate-950/50 p-2 rounded-lg">
              <div className="text-xs text-emerald-400 font-semibold">{data?.users?.customers || 0}</div>
              <div className="text-[10px] text-slate-500 uppercase mt-0.5">Customers</div>
            </div>
          </div>
        </div>

        {/* Products Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                <Package className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold text-slate-200">Catalog Inventory</span>
            </div>
            <button
              onClick={() => onNavigate('products')}
              className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-0.5 cursor-pointer"
            >
              <span>Manage</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-white tracking-tight">{data?.products?.total || 0}</span>
            <span className="text-xs font-mono text-slate-400">Total catalog SKU</span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/60 text-center">
            <div className="bg-slate-950/50 p-2 rounded-lg">
              <div className="text-xs text-emerald-400 font-semibold">{data?.products?.published || 0}</div>
              <div className="text-[10px] text-slate-500 uppercase mt-0.5">Live</div>
            </div>
            <div className="bg-slate-950/50 p-2 rounded-lg">
              <div className="text-xs text-amber-400 font-semibold">{data?.products?.draft || 0}</div>
              <div className="text-[10px] text-slate-500 uppercase mt-0.5">Draft</div>
            </div>
            <div className="bg-slate-950/50 p-2 rounded-lg">
              <div className="text-xs text-slate-400 font-semibold">{data?.products?.archived || 0}</div>
              <div className="text-[10px] text-slate-500 uppercase mt-0.5">Archived</div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center space-x-4">
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-lg">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{data?.offers?.active || 0}</div>
            <div className="text-xs text-slate-400">Active Promotional Offers ({data?.offers?.total || 0} total)</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center space-x-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{data?.invoices || 0}</div>
            <div className="text-xs text-slate-400">Invoices Processed</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center space-x-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{data?.users?.developers || 1}</div>
            <div className="text-xs text-slate-400">CLI Developers Provisioned</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSection;
