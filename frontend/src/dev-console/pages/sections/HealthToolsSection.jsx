import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/adminApi';
import {
  Activity,
  Database,
  Globe,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Search,
  ExternalLink,
  Zap,
} from 'lucide-react';

const ENDPOINTS_TO_TEST = [
  { name: 'Shops Public Catalog', path: '/api/shops/', apiPath: 'shops/' },
  { name: 'Products Public Directory', path: '/api/products/', apiPath: 'products/' },
  { name: 'Offers Registry', path: '/api/offers/', apiPath: 'offers/' },
  {
    name: 'Customer App Remote Settings',
    path: '/api/app-settings/customer_app/',
    apiPath: 'app-settings/customer_app/',
  },
  {
    name: 'Shop Owner App Remote Settings',
    path: '/api/app-settings/owner_app/',
    apiPath: 'app-settings/owner_app/',
  },
];

const HealthToolsSection = () => {
  const [healthData, setHealthData] = useState(null);
  const [consistencyData, setConsistencyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ping test states
  const [endpointResults, setEndpointResults] = useState({});
  const [testingEndpoints, setTestingEndpoints] = useState(false);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const [hRes, cRes] = await Promise.all([
        adminApi.getHealth(),
        adminApi.getConsistencyCheck(),
      ]);
      setHealthData(hRes.data);
      setConsistencyData(cRes.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load system health and consistency data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  if (loading || !healthData || !consistencyData) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center gap-4 text-slate-400">
        {loading ? (
          <>
            <RefreshCw className="h-6 w-6 animate-spin text-indigo-400" />
            <span className="text-sm">Loading health and consistency data...</span>
          </>
        ) : (
          <>
            <AlertTriangle className="h-7 w-7 text-rose-400" />
            <span className="text-sm text-rose-300">
              {error || 'System health data is unavailable.'}
            </span>
            <button
              onClick={fetchHealth}
              className="rounded-lg bg-slate-800 px-3 py-2 text-xs text-slate-200 hover:bg-slate-700"
            >
              Retry
            </button>
          </>
        )}
      </div>
    );
  }

  const runAllEndpointTests = async () => {
    setTestingEndpoints(true);
    const results = {};
    for (const ep of ENDPOINTS_TO_TEST) {
      const startTime = performance.now();
      try {
        const res = await adminApi.probePublicEndpoint(ep.apiPath);
        const duration = Math.round(performance.now() - startTime);
        results[ep.path] = {
          status: res.status,
          ok: true,
          duration,
        };
      } catch (e) {
        results[ep.path] = {
          status: e.response?.status || 'ERR',
          ok: false,
          error: e.response?.data?.detail || e.message,
        };
      }
    }
    setEndpointResults(results);
    setTestingEndpoints(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Diagnostics & Data Consistency Scanner</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time latency metrics, API connectivity tests, and catalog integrity validation.
          </p>
        </div>
        <button
          onClick={fetchHealth}
          disabled={loading}
          className="inline-flex items-center space-x-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Re-scan System</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-950/40 border border-red-800/60 rounded-xl text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Grid: Health Card & API URLs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Database Health Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2.5">
              <Database className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-semibold text-white">Database Connection Health</h3>
            </div>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                healthData?.database?.healthy
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'bg-red-500/10 text-red-400 border border-red-500/30'
              }`}
            >
              {healthData?.database?.healthy ? 'HEALTHY' : 'ERROR'}
            </span>
          </div>

          <div className="mt-4 space-y-3 text-xs">
            <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60 font-mono">
              <span className="text-slate-400">Query Ping Latency:</span>
              <span className="text-emerald-400 font-semibold">
                {healthData?.database?.latency_ms !== null
                  ? `${healthData.database.latency_ms} ms`
                  : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60 font-mono">
              <span className="text-slate-400">Database Engine:</span>
              <span className="text-slate-300">
                {healthData?.database?.engine || 'Unknown'}
              </span>
            </div>
            <div className="flex justify-between items-center py-1.5 font-mono">
              <span className="text-slate-400">Backend Port / Host:</span>
              <span className="text-slate-300">{healthData?.api_base_urls?.backend || '127.0.0.1:8000'}</span>
            </div>
          </div>
        </div>

        {/* API Base URLs Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-800">
            <Globe className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">Active Service Endpoints</h3>
          </div>

          <div className="mt-4 space-y-2.5 text-xs font-mono">
            <div>
              <span className="text-[10px] text-slate-500 uppercase">Core Backend API:</span>
              <div className="text-slate-200 bg-slate-950 p-2 rounded border border-slate-800/80 truncate">
                {healthData?.api_base_urls?.public || 'http://127.0.0.1:8000/api/'}
              </div>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase">Developer Admin Gateway:</span>
              <div className="text-indigo-300 bg-slate-950 p-2 rounded border border-slate-800/80 truncate">
                {healthData?.api_base_urls?.admin || 'http://127.0.0.1:8000/api/admin/'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Connectivity Test Runner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-white">Public API Endpoints Connectivity Probe</h3>
          </div>
          <button
            onClick={runAllEndpointTests}
            disabled={testingEndpoints}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testingEndpoints ? 'animate-spin' : ''}`} />
            <span>{testingEndpoints ? 'Probing...' : 'Run Connectivity Test'}</span>
          </button>
        </div>

        <div className="mt-4 divide-y divide-slate-800/60">
          {ENDPOINTS_TO_TEST.map((ep) => {
            const res = endpointResults[ep.path];
            return (
              <div key={ep.path} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-slate-200">{ep.name}</div>
                  <div className="text-[11px] font-mono text-slate-500">{ep.path}</div>
                </div>
                <div className="flex items-center space-x-3">
                  {res ? (
                    <>
                      <span className="font-mono text-[11px] text-slate-400">
                        {res.duration ? `${res.duration}ms` : ''}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                          res.ok
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-red-500/10 text-red-400 border border-red-500/30'
                        }`}
                      >
                        HTTP {res.status}
                      </span>
                    </>
                  ) : (
                    <span className="text-[11px] font-mono text-slate-600">Untested</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Consistency Check Results */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-white">Data Consistency & App Visibility Audit</h3>
        </div>

        <div className="mt-4 space-y-4">
          {/* Missing details */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div className="text-xs font-semibold text-slate-300 flex items-center justify-between mb-2">
              <span>Published Shops Missing Location or Contact Phone</span>
              <span className="font-mono text-amber-400">
                {consistencyData?.published_shops_missing_details?.length || 0} issues
              </span>
            </div>
            {consistencyData?.published_shops_missing_details?.length > 0 ? (
              <ul className="space-y-1.5 text-xs text-slate-400 font-mono">
                {consistencyData.published_shops_missing_details.map((s) => (
                  <li key={s.id} className="p-2 bg-slate-900 rounded border border-slate-800 flex justify-between">
                    <span>{s.name} (#{s.id})</span>
                    <span className="text-amber-400 text-[11px]">
                      {!s.address ? 'Missing Address ' : ''}
                      {!s.phone ? 'Missing Phone' : ''}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500">All published shops have complete contact information.</p>
            )}
          </div>

          {/* Draft shops */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div className="text-xs font-semibold text-slate-300 flex items-center justify-between mb-2">
              <span>Unpublished Shops in DRAFT Mode (Hidden from Customer App)</span>
              <span className="font-mono text-slate-400">
                {consistencyData?.draft_shops?.length || 0} shops
              </span>
            </div>
            {consistencyData?.draft_shops?.length > 0 ? (
              <ul className="space-y-1.5 text-xs text-slate-400 font-mono">
                {consistencyData.draft_shops.map((s) => (
                  <li key={s.id} className="p-2 bg-slate-900 rounded border border-slate-800 flex justify-between">
                    <span>{s.name} (#{s.id})</span>
                    <span className="text-slate-500 text-[11px]">Pending Developer/Owner Publish</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500">No shops in draft state.</p>
            )}
          </div>

          {/* Published shops with zero products */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div className="text-xs font-semibold text-slate-300 flex items-center justify-between mb-2">
              <span>Published Shops With Zero Live Products (Empty Storefronts)</span>
              <span className="font-mono text-amber-400">
                {consistencyData?.published_shops_with_no_products?.length || 0} shops
              </span>
            </div>
            {consistencyData?.published_shops_with_no_products?.length > 0 ? (
              <ul className="space-y-1.5 text-xs text-slate-400 font-mono">
                {consistencyData.published_shops_with_no_products.map((s) => (
                  <li key={s.id} className="p-2 bg-slate-900 rounded border border-slate-800 flex justify-between">
                    <span>{s.name} (#{s.id})</span>
                    <span className="text-amber-400 text-[11px]">0 live products</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500">All published shops have active inventory.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthToolsSection;
