import React, { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';
import ConfirmDialog from '../../components/ConfirmDialog';
import {
  Store,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Edit,
  Eye,
  RefreshCw,
  Phone,
  MapPin,
  X,
  ExternalLink,
} from 'lucide-react';

const ShopsSection = () => {
  const { success, error: toastError, info } = useToast();
  const [shops, setShops] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  // Detail Modal
  const [viewShop, setViewShop] = useState(null);

  // Edit Modal
  const [editShop, setEditShop] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [editLoading, setEditLoading] = useState(false);

  // Confirm Dialog
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: '',
    confirmVariant: 'danger',
    action: null,
  });

  const fetchShops = useCallback(async (isRefresh = false) => {
    setLoading(true);
    setError(null);
    try {
      const params = { page };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;

      const res = await adminApi.getShops(params);
      if (res.data?.results) {
        setShops(res.data.results);
        setTotalCount(res.data.count);
      } else {
        setShops(res.data);
        setTotalCount(res.data.length);
      }
      if (isRefresh) {
        info('Store registry refreshed');
      }
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to fetch shops.';
      setError(msg);
      toastError(msg);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, info, toastError]);

  useEffect(() => {
    fetchShops();
  }, [fetchShops]);

  const handleActionClick = (shop, actionType) => {
    if (actionType === 'publish') {
      setConfirmConfig({
        isOpen: true,
        title: `Publish "${shop.name}"?`,
        message: 'This shop will immediately become visible to all mobile Customer App users in live discovery.',
        confirmText: 'Publish Live',
        confirmVariant: 'primary',
        action: async () => {
          try {
            await adminApi.publishShop(shop.id);
            success(`Shop "${shop.name}" published live to Customer App.`);
            fetchShops();
          } catch (err) {
            toastError(err.response?.data?.detail || 'Failed to publish shop.');
          }
        },
      });
    } else if (actionType === 'unpublish') {
      setConfirmConfig({
        isOpen: true,
        title: `Unpublish "${shop.name}"?`,
        message: 'This shop will be set back to DRAFT mode and will no longer appear in Customer App searches.',
        confirmText: 'Unpublish to Draft',
        confirmVariant: 'warning',
        action: async () => {
          try {
            await adminApi.unpublishShop(shop.id);
            info(`Shop "${shop.name}" moved back to draft mode.`);
            fetchShops();
          } catch (err) {
            toastError(err.response?.data?.detail || 'Failed to unpublish shop.');
          }
        },
      });
    } else if (actionType === 'suspend') {
      setConfirmConfig({
        isOpen: true,
        title: `Suspend "${shop.name}"?`,
        message: 'Suspension immediately freezes public catalog visibility and revokes worker checkout privileges.',
        confirmText: 'Suspend Store',
        confirmVariant: 'danger',
        action: async () => {
          try {
            await adminApi.suspendShop(shop.id);
            success(`Shop "${shop.name}" suspended.`);
            fetchShops();
          } catch (err) {
            toastError(err.response?.data?.detail || 'Failed to suspend shop.');
          }
        },
      });
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editShop) return;
    setEditLoading(true);
    try {
      await adminApi.updateShop(editShop.id, editFormData);
      success(`Shop "${editFormData.name}" updated successfully.`);
      setEditShop(null);
      fetchShops();
    } catch (err) {
      toastError(err.response?.data?.detail || 'Failed to update shop.');
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2.5">
            <span>Shop Registry & Moderation</span>
            <span className="text-xs font-mono text-slate-400 bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700/60 font-medium">
              {totalCount} Total Stores
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review, approve, publish, edit, or suspend merchant storefronts in real time.
          </p>
        </div>
        <button
          onClick={() => fetchShops(true)}
          disabled={loading}
          className="inline-flex items-center space-x-2 px-3.5 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700/80 transition-all self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by shop ID, name, category, or owner email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Status Pill Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { label: 'All Stores', value: '' },
            { label: 'Live / Published', value: 'PUBLISHED' },
            { label: 'Draft Queue', value: 'DRAFT' },
            { label: 'Suspended', value: 'SUSPENDED' },
          ].map((pill) => {
            const isActive = statusFilter === pill.value;
            return (
              <button
                key={pill.value}
                onClick={() => {
                  setStatusFilter(pill.value);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-800/60 rounded-xl text-rose-300 text-xs flex items-center space-x-3">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-black/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/70 text-slate-400 uppercase tracking-wider border-b border-slate-800 font-medium">
              <tr>
                <th className="px-5 py-3.5">Store ID</th>
                <th className="px-5 py-3.5">Store & Address</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Owner Contact</th>
                <th className="px-5 py-3.5 text-center">Catalog SKUs</th>
                <th className="px-5 py-3.5 text-center">Staff Count</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-5 py-12 text-center text-slate-400">
                    <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>Loading stores directory...</span>
                  </td>
                </tr>
              ) : shops.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-5 py-12 text-center text-slate-500">
                    No shops match the selected filters.
                  </td>
                </tr>
              ) : (
                shops.map((shop) => (
                  <tr key={shop.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-slate-400 font-medium">#{shop.id}</td>
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-white text-sm">{shop.name}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate max-w-xs">{shop.address || 'Address unassigned'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-300 font-medium">{shop.category || 'General'}</td>
                    <td className="px-5 py-3.5">
                      <div className="text-slate-300 font-mono text-xs">{shop.owner_email || '—'}</div>
                      {shop.phone && (
                        <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <Phone className="w-3.5 h-3.5 text-slate-500" />
                          <span>{shop.phone}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-center font-mono text-slate-200 font-medium">{shop.product_count ?? 0}</td>
                    <td className="px-5 py-3.5 text-center font-mono text-slate-200 font-medium">{shop.worker_count ?? 0}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          shop.status === 'PUBLISHED'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : shop.status === 'DRAFT'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            shop.status === 'PUBLISHED'
                              ? 'bg-emerald-400 animate-pulse'
                              : shop.status === 'DRAFT'
                              ? 'bg-amber-400'
                              : 'bg-rose-400'
                          }`}
                        />
                        {shop.status === 'PUBLISHED' ? 'Live' : shop.status === 'DRAFT' ? 'Draft' : 'Suspended'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setViewShop(shop)}
                          title="View Details"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditShop(shop);
                            setEditFormData({
                              name: shop.name || '',
                              category: shop.category || '',
                              description: shop.description || '',
                              address: shop.address || '',
                              phone: shop.phone || '',
                              business_hours: shop.business_hours || '',
                            });
                          }}
                          title="Edit Store Information"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {shop.status === 'DRAFT' && (
                          <button
                            onClick={() => handleActionClick(shop, 'publish')}
                            className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium shadow-sm transition-colors cursor-pointer"
                          >
                            Publish
                          </button>
                        )}

                        {shop.status === 'PUBLISHED' && (
                          <>
                            <button
                              onClick={() => handleActionClick(shop, 'unpublish')}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-800/40 text-xs font-medium transition-colors cursor-pointer"
                            >
                              Unpublish
                            </button>
                            <button
                              onClick={() => handleActionClick(shop, 'suspend')}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-rose-400 border border-rose-800/40 text-xs font-medium transition-colors cursor-pointer"
                            >
                              Suspend
                            </button>
                          </>
                        )}

                        {shop.status === 'SUSPENDED' && (
                          <button
                            onClick={() => handleActionClick(shop, 'publish')}
                            className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors cursor-pointer"
                          >
                            Re-activate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Shop Modal */}
      {viewShop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-white">{viewShop.name}</h3>
                  <div className="text-xs text-slate-400">Store ID: #{viewShop.id}</div>
                </div>
              </div>
              <button
                onClick={() => setViewShop(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-slate-500 font-medium">Status</span>
                  <div className="font-semibold text-white mt-1">{viewShop.status}</div>
                </div>
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-slate-500 font-medium">Category</span>
                  <div className="font-semibold text-white mt-1">{viewShop.category || 'General'}</div>
                </div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-slate-500 font-medium">Owner Email Account</span>
                <div className="font-mono text-slate-200 mt-1">{viewShop.owner_email}</div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-slate-500 font-medium">Physical Address</span>
                <div className="text-slate-200 mt-1">{viewShop.address || 'None provided'}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-slate-500 font-medium">Phone Contact</span>
                  <div className="text-slate-200 mt-1">{viewShop.phone || 'None'}</div>
                </div>
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-slate-500 font-medium">Business Hours</span>
                  <div className="text-slate-200 mt-1">{viewShop.business_hours || 'Standard (9:00 AM - 9:00 PM)'}</div>
                </div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-slate-500 font-medium">Store Description</span>
                <div className="text-slate-300 mt-1 leading-relaxed">{viewShop.description || 'No description entered.'}</div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setViewShop(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl transition-colors cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Shop Modal */}
      {editShop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="font-semibold text-lg text-white">Edit Store Details</h3>
              <button
                onClick={() => setEditShop(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="mt-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Store Name</label>
                <input
                  type="text"
                  value={editFormData.name || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">Category</label>
                  <input
                    type="text"
                    value={editFormData.category || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">Contact Phone</label>
                  <input
                    type="text"
                    value={editFormData.phone || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Physical Address</label>
                <textarea
                  rows="2"
                  value={editFormData.address || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Business Hours</label>
                <input
                  type="text"
                  value={editFormData.business_hours || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, business_hours: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  placeholder="e.g. 9:00 AM - 10:00 PM"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Description</label>
                <textarea
                  rows="3"
                  value={editFormData.description || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 leading-relaxed"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={() => setEditShop(null)}
                  className="px-4 py-2 border border-slate-700/80 rounded-xl text-slate-300 hover:bg-slate-800 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium transition-colors cursor-pointer shadow-md shadow-indigo-600/30"
                >
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
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
        onConfirm={async () => {
          if (confirmConfig.action) {
            await confirmConfig.action();
          }
          setConfirmConfig({ ...confirmConfig, isOpen: false });
        }}
        onCancel={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
      />
    </div>
  );
};

export default ShopsSection;
