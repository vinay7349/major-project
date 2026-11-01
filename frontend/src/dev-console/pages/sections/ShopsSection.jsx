import React, { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../../services/adminApi';
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
  Clock,
  Phone,
  MapPin,
  X,
} from 'lucide-react';

const ShopsSection = () => {
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

  const fetchShops = useCallback(async () => {
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
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch shops.');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

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
          await adminApi.publishShop(shop.id);
          fetchShops();
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
          await adminApi.unpublishShop(shop.id);
          fetchShops();
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
          await adminApi.suspendShop(shop.id);
          fetchShops();
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
      setEditShop(null);
      fetchShops();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to update shop.');
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Shop Registry & Moderation</span>
            <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
              {totalCount} Total
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Review, approve, publish, edit, or suspend merchant storefronts.
          </p>
        </div>
        <button
          onClick={fetchShops}
          disabled={loading}
          className="inline-flex items-center space-x-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search by shop name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-950/40 border border-red-800/60 rounded-xl text-red-300 text-sm flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-mono uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Store Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Owner Contact</th>
                <th className="px-4 py-3 text-center">Products</th>
                <th className="px-4 py-3 text-center">Staff</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-slate-500">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-indigo-400" />
                    <span>Loading shops directory...</span>
                  </td>
                </tr>
              ) : shops.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-slate-500">
                    No shops match the given filters.
                  </td>
                </tr>
              ) : (
                shops.map((shop) => (
                  <tr key={shop.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-mono text-slate-400">#{shop.id}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-white">{shop.name}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-600 flex-shrink-0" />
                        <span className="truncate max-w-xs">{shop.address || 'Address unassigned'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300 font-medium">{shop.category || 'General'}</td>
                    <td className="px-4 py-3">
                      <div className="text-slate-300 font-mono text-[11px]">{shop.owner_email || '—'}</div>
                      {shop.phone && (
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3" />
                          <span>{shop.phone}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-slate-300">{shop.product_count ?? 0}</td>
                    <td className="px-4 py-3 text-center font-mono text-slate-300">{shop.worker_count ?? 0}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase ${
                          shop.status === 'PUBLISHED'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : shop.status === 'DRAFT'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-red-500/10 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {shop.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => setViewShop(shop)}
                          title="View Details"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
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
                          title="Edit Shop Details"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        {shop.status === 'DRAFT' && (
                          <button
                            onClick={() => handleActionClick(shop, 'publish')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-600/40 text-[11px] font-medium transition-colors cursor-pointer"
                          >
                            Publish
                          </button>
                        )}

                        {shop.status === 'PUBLISHED' && (
                          <>
                            <button
                              onClick={() => handleActionClick(shop, 'unpublish')}
                              className="px-2.5 py-1 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-600/40 text-[11px] font-medium transition-colors cursor-pointer"
                            >
                              Unpublish
                            </button>
                            <button
                              onClick={() => handleActionClick(shop, 'suspend')}
                              className="px-2.5 py-1 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/40 text-[11px] font-medium transition-colors cursor-pointer"
                            >
                              Suspend
                            </button>
                          </>
                        )}

                        {shop.status === 'SUSPENDED' && (
                          <button
                            onClick={() => handleActionClick(shop, 'publish')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-600/40 text-[11px] font-medium transition-colors cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Store className="w-5 h-5 text-indigo-400" />
                <h3 className="font-semibold text-lg">{viewShop.name}</h3>
              </div>
              <button
                onClick={() => setViewShop(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 font-mono">STATUS:</span>
                  <div className="font-semibold text-slate-200 mt-0.5">{viewShop.status}</div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 font-mono">CATEGORY:</span>
                  <div className="font-semibold text-slate-200 mt-0.5">{viewShop.category}</div>
                </div>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 font-mono">OWNER EMAIL:</span>
                <div className="font-semibold text-slate-200 mt-0.5">{viewShop.owner_email}</div>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 font-mono">PHYSICAL ADDRESS:</span>
                <div className="text-slate-300 mt-0.5">{viewShop.address || 'None provided'}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 font-mono">PHONE:</span>
                  <div className="text-slate-300 mt-0.5">{viewShop.phone || 'None'}</div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 font-mono">BUSINESS HOURS:</span>
                  <div className="text-slate-300 mt-0.5">{viewShop.business_hours || 'Standard'}</div>
                </div>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 font-mono">DESCRIPTION:</span>
                <div className="text-slate-300 mt-0.5">{viewShop.description || 'No description entered.'}</div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setViewShop(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Shop Modal */}
      {editShop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-semibold text-lg">Edit Shop: {editShop.name}</h3>
              <button
                onClick={() => setEditShop(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-mono">STORE NAME</label>
                <input
                  type="text"
                  value={editFormData.name || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">CATEGORY</label>
                  <input
                    type="text"
                    value={editFormData.category || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">CONTACT PHONE</label>
                  <input
                    type="text"
                    value={editFormData.phone || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono">PHYSICAL ADDRESS</label>
                <textarea
                  rows="2"
                  value={editFormData.address || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono">BUSINESS HOURS</label>
                <input
                  type="text"
                  value={editFormData.business_hours || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, business_hours: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="e.g. 9:00 AM - 10:00 PM"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono">DESCRIPTION</label>
                <textarea
                  rows="3"
                  value={editFormData.description || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditShop(null)}
                  className="px-4 py-2 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium"
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
