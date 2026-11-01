import React, { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../../services/adminApi';
import ConfirmDialog from '../../components/ConfirmDialog';
import {
  Package,
  Tag,
  Search,
  Filter,
  Eye,
  Edit,
  Archive,
  RefreshCw,
  AlertTriangle,
  X,
  CheckCircle,
  XCircle,
} from 'lucide-react';

const ProductsSection = () => {
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'offers'

  // Products state
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [prodLoading, setProdLoading] = useState(true);
  const [prodSearch, setProdSearch] = useState('');
  const [prodStatusFilter, setProdStatusFilter] = useState('');
  const [prodPage, setProdPage] = useState(1);

  // Offers state
  const [offers, setOffers] = useState([]);
  const [totalOffers, setTotalOffers] = useState(0);
  const [offerLoading, setOfferLoading] = useState(false);
  const [offerPage, setOfferPage] = useState(1);

  // Modals
  const [viewProduct, setViewProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
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

  const fetchProducts = useCallback(async () => {
    setProdLoading(true);
    try {
      const params = { page: prodPage };
      if (prodSearch) params.search = prodSearch;
      if (prodStatusFilter) params.status = prodStatusFilter;

      const res = await adminApi.getProducts(params);
      if (res.data?.results) {
        setProducts(res.data.results);
        setTotalProducts(res.data.count);
      } else {
        setProducts(res.data);
        setTotalProducts(res.data.length);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProdLoading(false);
    }
  }, [prodPage, prodSearch, prodStatusFilter]);

  const fetchOffers = useCallback(async () => {
    setOfferLoading(true);
    try {
      const res = await adminApi.getOffers({ page: offerPage });
      if (res.data?.results) {
        setOffers(res.data.results);
        setTotalOffers(res.data.count);
      } else {
        setOffers(res.data);
        setTotalOffers(res.data.length);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setOfferLoading(false);
    }
  }, [offerPage]);

  useEffect(() => {
    if (activeTab === 'products') {
      fetchProducts();
    } else {
      fetchOffers();
    }
  }, [activeTab, fetchProducts, fetchOffers]);

  // Soft-delete action: Status set to ARCHIVED
  const handleArchiveProduct = (product) => {
    setConfirmConfig({
      isOpen: true,
      title: `Archive "${product.name}"?`,
      message: 'This soft-deletes the product by setting status to ARCHIVED. Historical sales records and invoices will remain intact, but customers will no longer be able to purchase or view it.',
      confirmText: 'Soft-Delete (Archive)',
      confirmVariant: 'danger',
      action: async () => {
        await adminApi.archiveProduct(product.id);
        fetchProducts();
      },
    });
  };

  const handleToggleOffer = (offer) => {
    const nextState = !offer.is_active;
    setConfirmConfig({
      isOpen: true,
      title: `${nextState ? 'Activate' : 'Deactivate'} Offer "${offer.title}"?`,
      message: nextState
        ? 'The promotional discount will immediately become active in the customer cart and checkout.'
        : 'The discount will be disabled across all customer checkouts immediately.',
      confirmText: nextState ? 'Activate Offer' : 'Deactivate Offer',
      confirmVariant: nextState ? 'primary' : 'warning',
      action: async () => {
        await adminApi.updateOffer(offer.id, { is_active: nextState });
        fetchOffers();
      },
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editProduct) return;
    setEditLoading(true);
    try {
      await adminApi.updateProduct(editProduct.id, editFormData);
      setEditProduct(null);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to update product.');
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Products & Promotions Catalog</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Global catalog management with safe soft-deletion (status = ARCHIVED).
          </p>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-2 ${
              activeTab === 'products'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Products ({totalProducts})</span>
          </button>
          <button
            onClick={() => setActiveTab('offers')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-2 ${
              activeTab === 'offers'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Offers ({totalOffers})</span>
          </button>
        </div>
      </div>

      {activeTab === 'products' ? (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                placeholder="Search products by title..."
                value={prodSearch}
                onChange={(e) => {
                  setProdSearch(e.target.value);
                  setProdPage(1);
                }}
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <select
                value={prodStatusFilter}
                onChange={(e) => {
                  setProdStatusFilter(e.target.value);
                  setProdPage(1);
                }}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">All Statuses</option>
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
                <option value="ARCHIVED">Archived (Soft-Deleted)</option>
              </select>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 font-mono uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Product Name & Brand</th>
                    <th className="px-4 py-3">Assigned Shop</th>
                    <th className="px-4 py-3">Pricing (MRP / Sell)</th>
                    <th className="px-4 py-3 text-center">Stock</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {prodLoading ? (
                    <tr>
                      <td colSpan="7" className="px-4 py-8 text-center text-slate-500">
                        <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-indigo-400" />
                        <span>Loading product inventory...</span>
                      </td>
                    </tr>
                  ) : products.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-4 py-8 text-center text-slate-500">
                        No products found matching criteria.
                      </td>
                    </tr>
                  ) : (
                    products.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-3 font-mono text-slate-400">#{p.id}</td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-white">{p.name}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                            <span>{p.category}</span>
                            {p.brand && <span>• {p.brand}</span>}
                            {p.barcode && <span className="font-mono">[{p.barcode}]</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-300 font-medium">
                          {p.shop_name || `Shop #${p.shop_id}`}
                        </td>
                        <td className="px-4 py-3 font-mono">
                          <span className="text-slate-400 line-through mr-1.5">₹{p.mrp}</span>
                          <span className="text-emerald-400 font-semibold">₹{p.selling_price}</span>
                        </td>
                        <td className="px-4 py-3 text-center font-mono">
                          <span className={p.stock_quantity <= 5 ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                            {p.stock_quantity} {p.unit}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase ${
                              p.status === 'PUBLISHED'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : p.status === 'DRAFT'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                : 'bg-slate-500/10 text-slate-400 border border-slate-500/30'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => setViewProduct(p)}
                              title="View Details"
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setEditProduct(p);
                                setEditFormData({
                                  name: p.name || '',
                                  category: p.category || '',
                                  brand: p.brand || '',
                                  mrp: p.mrp || 0,
                                  selling_price: p.selling_price || 0,
                                  stock_quantity: p.stock_quantity || 0,
                                  barcode: p.barcode || '',
                                  description: p.description || '',
                                });
                              }}
                              title="Edit Product"
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            {p.status !== 'ARCHIVED' && (
                              <button
                                onClick={() => handleArchiveProduct(p)}
                                title="Soft-delete (Archive)"
                                className="px-2.5 py-1 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/40 text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <Archive className="w-3 h-3" />
                                <span>Archive</span>
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
        </div>
      ) : (
        /* Offers Table */
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 font-mono uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Promotion Title</th>
                  <th className="px-4 py-3">Store</th>
                  <th className="px-4 py-3">Discount</th>
                  <th className="px-4 py-3">Scope</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {offerLoading ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-slate-500">
                      <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-indigo-400" />
                      <span>Loading promotions...</span>
                    </td>
                  </tr>
                ) : offers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-slate-500">
                      No offers currently registered in the database.
                    </td>
                  </tr>
                ) : (
                  offers.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3 font-mono text-slate-400">#{o.id}</td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-white">{o.title}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{o.description || 'No description'}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-300 font-medium">
                        {o.shop_name || `Shop #${o.shop_id}`}
                      </td>
                      <td className="px-4 py-3 font-mono text-emerald-400 font-semibold">
                        {o.discount_value} {o.discount_type === 'PERCENTAGE' ? '%' : '₹'}
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-400">{o.scope}</td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            o.is_active
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-red-500/10 text-red-400 border border-red-500/30'
                          }`}
                        >
                          {o.is_active ? 'ACTIVE' : 'DEACTIVATED'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleToggleOffer(o)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                            o.is_active
                              ? 'bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-600/40'
                              : 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-600/40'
                          }`}
                        >
                          {o.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Product Modal */}
      {viewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Package className="w-5 h-5 text-indigo-400" />
                <span>{viewProduct.name}</span>
              </h3>
              <button
                onClick={() => setViewProduct(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 font-mono">STATUS:</span>
                  <div className="font-semibold text-slate-200 mt-0.5">{viewProduct.status}</div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 font-mono">STOCK:</span>
                  <div className="font-semibold text-slate-200 mt-0.5">
                    {viewProduct.stock_quantity} {viewProduct.unit}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 font-mono">MRP:</span>
                  <div className="text-slate-400 font-mono mt-0.5">₹{viewProduct.mrp}</div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 font-mono">SELLING PRICE:</span>
                  <div className="text-emerald-400 font-mono font-bold mt-0.5">₹{viewProduct.selling_price}</div>
                </div>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 font-mono">STORE:</span>
                <div className="text-slate-200 mt-0.5">{viewProduct.shop_name}</div>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 font-mono">BARCODE:</span>
                <div className="font-mono text-slate-300 mt-0.5">{viewProduct.barcode || 'None'}</div>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 font-mono">DESCRIPTION:</span>
                <div className="text-slate-300 mt-0.5">{viewProduct.description || 'No description provided.'}</div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setViewProduct(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-semibold text-lg">Edit Product: #{editProduct.id}</h3>
              <button
                onClick={() => setEditProduct(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-mono">NAME</label>
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
                  <label className="block text-slate-400 mb-1 font-mono">BRAND</label>
                  <input
                    type="text"
                    value={editFormData.brand || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, brand: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">MRP (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editFormData.mrp ?? 0}
                    onChange={(e) => setEditFormData({ ...editFormData, mrp: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">SELLING (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editFormData.selling_price ?? 0}
                    onChange={(e) => setEditFormData({ ...editFormData, selling_price: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">STOCK QTY</label>
                  <input
                    type="number"
                    value={editFormData.stock_quantity ?? 0}
                    onChange={(e) => setEditFormData({ ...editFormData, stock_quantity: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono">BARCODE</label>
                <input
                  type="text"
                  value={editFormData.barcode || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, barcode: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditProduct(null)}
                  className="px-4 py-2 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium"
                >
                  {editLoading ? 'Saving...' : 'Save Product'}
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

export default ProductsSection;
