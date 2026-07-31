import React, { useEffect, useState } from 'react';
import { Plus, Search, Filter, Edit3, Trash2, Barcode, Package, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { productsAPI } from '../services/api';
import GlassCard from '../components/GlassCard';
import { TableSkeleton } from '../components/LoadingSkeleton';
import { useToast } from '../context/NotificationContext';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showBarcodeModal, setShowBarcodeModal] = useState(null);
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    barcode: '',
    category: '',
    price: '',
    cost_price: '',
    stock_quantity: '',
    min_stock_level: 5,
    description: '',
    image_url: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        productsAPI.getAll({ search, category: selectedCategory }),
        productsAPI.getCategories(),
      ]);
      setProducts(prodRes.data.results || prodRes.data || []);
      setCategories(catRes.data.results || catRes.data || []);
    } catch (err) {
      console.error(err);
      addToast('Could not fetch products from server', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, selectedCategory]);

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await productsAPI.update(editingProduct.id, formData);
        addToast('Product updated successfully!', 'success');
      } else {
        await productsAPI.create(formData);
        addToast('New product added to catalog!', 'success');
      }
      setShowAddModal(false);
      setEditingProduct(null);
      fetchData();
    } catch (err) {
      console.error(err);
      addToast('Error saving product details', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsAPI.delete(id);
        addToast('Product removed from catalog', 'info');
        fetchData();
      } catch (err) {
        addToast('Error deleting product', 'error');
      }
    }
  };

  const openEditModal = (p) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      sku: p.sku,
      barcode: p.barcode || '',
      category: p.category,
      price: p.price,
      cost_price: p.cost_price || 0,
      stock_quantity: p.stock_quantity,
      min_stock_level: p.min_stock_level,
      description: p.description || '',
      image_url: p.image_url || '',
    });
    setShowAddModal(true);
  };

  return (
    <div className="space-y-8">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">
            Product Catalog & SKU Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            Manage store inventory items, pricing, barcodes, and stock levels.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingProduct(null);
            setFormData({
              name: '',
              sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
              barcode: `890${Math.floor(1000000000 + Math.random() * 9000000000)}`,
              category: categories[0]?.id || 1,
              price: '',
              cost_price: '',
              stock_quantity: 20,
              min_stock_level: 5,
              description: '',
              image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
            });
            setShowAddModal(true);
          }}
          className="gradient-btn-primary px-5 py-3 rounded-xl font-bold text-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by product name, SKU or barcode..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      {loading ? (
        <TableSkeleton />
      ) : (
        <GlassCard className="p-0 overflow-hidden border-slate-200 dark:border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Product Info</th>
                  <th className="p-4">SKU / Barcode</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock Level</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-400">
                      No products found. Click "Add New Product" to create one.
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={p.image_url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80'}
                          alt={p.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-700/50"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-slate-100">{p.name}</p>
                          <p className="text-[10px] text-slate-400 truncate max-w-[200px]">{p.description}</p>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-[11px]">
                        <p className="font-semibold text-indigo-400">{p.sku}</p>
                        <p className="text-slate-400 flex items-center gap-1 cursor-pointer" onClick={() => setShowBarcodeModal(p)}>
                          <Barcode className="w-3.5 h-3.5" /> {p.barcode || 'N/A'}
                        </p>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-medium text-[10px]">
                          {p.category_name || 'General'}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                        ${parseFloat(p.price).toFixed(2)}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                          p.stock_quantity <= p.min_stock_level
                            ? 'bg-rose-500/10 border border-rose-500/30 text-rose-500'
                            : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                        }`}>
                          {p.stock_quantity <= p.min_stock_level ? (
                            <AlertCircle className="w-3 h-3" />
                          ) : (
                            <CheckCircle2 className="w-3 h-3" />
                          )}
                          {p.stock_quantity} in stock
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:text-indigo-400 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* Add / Edit Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="glass-card max-w-lg w-full rounded-3xl p-6 relative border border-slate-700/50 shadow-2xl">
            <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-slate-100 mb-4">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Organic Almond Milk 1L"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">SKU Code</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Barcode Number</label>
                  <input
                    type="text"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Retail Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Cost Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.cost_price}
                    onChange={(e) => setFormData({ ...formData, cost_price: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Low Stock Threshold</label>
                  <input
                    type="number"
                    required
                    value={formData.min_stock_level}
                    onChange={(e) => setFormData({ ...formData, min_stock_level: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Image URL</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full gradient-btn-primary py-3 rounded-xl font-bold text-sm mt-4"
              >
                Save Product
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Barcode Viewer Modal */}
      {showBarcodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="glass-card max-w-sm w-full rounded-3xl p-6 relative border border-slate-700 text-center">
            <button onClick={() => setShowBarcodeModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-2">{showBarcodeModal.name}</h3>
            <p className="text-xs text-slate-400 font-mono mb-4">{showBarcodeModal.barcode}</p>

            <div className="bg-white p-4 rounded-2xl flex items-center justify-center shadow-inner mb-4">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${showBarcodeModal.barcode}`}
                alt="Barcode QR"
                className="w-36 h-36 object-contain"
              />
            </div>
            <button onClick={() => window.print()} className="gradient-btn-primary px-6 py-2.5 rounded-xl text-xs font-bold w-full">
              Print Barcode Tag
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
