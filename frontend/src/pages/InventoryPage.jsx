import React, { useEffect, useState } from 'react';
import { Boxes, AlertTriangle, RefreshCw, PlusCircle, Download, Upload, CheckCircle2, History, Package } from 'lucide-react';
import { inventoryAPI, productsAPI } from '../services/api';
import GlassCard from '../components/GlassCard';
import { TableSkeleton } from '../components/LoadingSkeleton';
import { useToast } from '../context/NotificationContext';

const InventoryPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [restockQty, setRestockQty] = useState(20);
  const [supplier, setSupplier] = useState('Direct Wholesale Inc.');
  const { addToast } = useToast();

  const fetchInventoryData = async () => {
    setLoading(true);
    try {
      const [alertRes, logRes, prodRes] = await Promise.all([
        inventoryAPI.getAlerts(),
        inventoryAPI.getLogs(),
        productsAPI.getAll(),
      ]);
      setAlerts(alertRes.data.results || alertRes.data || []);
      setLogs(logRes.data.results || logRes.data || []);
      setProducts(prodRes.data.results || prodRes.data || []);
    } catch (err) {
      console.error(err);
      addToast('Error fetching inventory status', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const handleRestockSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      const res = await inventoryAPI.restock({
        product_id: selectedProduct.id,
        quantity: parseInt(restockQty),
        supplier_name: supplier,
      });
      addToast(res.data.message || 'Restock updated successfully!', 'success');
      setShowRestockModal(false);
      fetchInventoryData();
    } catch (err) {
      console.error(err);
      addToast('Failed to process restock request', 'error');
    }
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "SKU,Product Name,Stock Quantity,Min Level,Status\n"
      + products.map(p => `"${p.sku}","${p.name}",${p.stock_quantity},${p.min_stock_level},"${p.stock_quantity <= p.min_stock_level ? 'LOW STOCK' : 'OK'}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ShopGenie_Inventory_Report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    addToast('Inventory CSV Report downloaded', 'success');
  };

  return (
    <div className="space-y-8">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-charcoal dark:text-white">
            Smart Inventory Control & Stock Alerts
          </h1>
          <p className="text-slate dark:text-slate/80 text-xs mt-1">
            Automated stock threshold monitoring and supplier restock logs.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-charcoal hover:bg-charcoal text-white text-xs font-semibold flex items-center gap-2 transition-all border border-charcoal"
          >
            <Download className="w-4 h-4 text-cyan-400" /> Export CSV
          </button>
          <button
            onClick={() => {
              if (products.length > 0) {
                setSelectedProduct(products[0]);
                setShowRestockModal(true);
              }
            }}
            className="gradient-btn-primary px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" /> Quick Restock
          </button>
        </div>
      </div>

      {/* Active Low Stock Alerts Card */}
      <GlassCard className="border-red/30 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-red font-bold text-sm">
            <AlertTriangle className="w-5 h-5 animate-bounce" />
            <span>Active Low Stock Warnings</span>
          </div>
          <span className="px-3 py-1 rounded-full bg-red/10 text-rose-400 text-xs font-semibold">
            {alerts.length} Items Require Restock
          </span>
        </div>

        {alerts.length === 0 ? (
          <div className="p-6 text-center text-xs text-emerald-400 bg-mutedgreen/10 rounded-2xl border border-mutedgreen/20">
            <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-emerald-400" />
            All inventory items are currently above minimum safety stock thresholds!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {alerts.map((a) => (
              <div
                key={a.id}
                className="p-4 rounded-2xl bg-charcoal/60 border border-red/30 flex items-center justify-between"
              >
                <div className="space-y-1">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    a.alert_level === 'CRITICAL' ? 'bg-red text-white' : 'bg-amber/20 text-amber-300'
                  }`}>
                    {a.alert_level}
                  </span>
                  <h4 className="font-bold text-slate/60 text-xs">{a.product_details?.name || 'Product'}</h4>
                  <p className="text-[11px] text-slate/80">{a.message}</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedProduct(a.product_details);
                    setShowRestockModal(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-charcoal hover:bg-charcoal text-white text-xs font-bold whitespace-nowrap ml-3"
                >
                  Restock Now
                </button>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* Stock Tracking Table */}
      {loading ? (
        <TableSkeleton />
      ) : (
        <GlassCard className="p-0 overflow-hidden border-charcoal space-y-0">
          <div className="p-4 bg-charcoal/80 border-b border-charcoal flex justify-between items-center">
            <h3 className="font-bold text-slate/60 text-sm flex items-center gap-2">
              <Boxes className="w-4 h-4 text-indigo-400" /> Stock Level Registry
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-charcoal/40 border-b border-charcoal text-slate/80 uppercase font-semibold">
                <tr>
                  <th className="p-4">SKU / Item</th>
                  <th className="p-4">Current Stock</th>
                  <th className="p-4">Min Safety Level</th>
                  <th className="p-4">Stock Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate/60">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-charcoal/40 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-white">{p.name}</p>
                      <p className="text-[10px] text-indigo-400 font-mono">{p.sku}</p>
                    </td>
                    <td className="p-4 font-mono font-bold text-lg text-white">
                      {p.stock_quantity}
                    </td>
                    <td className="p-4 font-mono text-slate/80">
                      {p.min_stock_level}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        p.stock_quantity <= p.min_stock_level
                          ? 'bg-red/20 text-rose-400 border border-red/30'
                          : 'bg-mutedgreen/20 text-emerald-400 border border-mutedgreen/30'
                      }`}>
                        {p.stock_quantity <= p.min_stock_level ? 'LOW STOCK' : 'HEALTHY'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedProduct(p);
                          setShowRestockModal(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-charcoal hover:bg-charcoal text-slate/60 text-xs font-semibold"
                      >
                        + Add Stock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* Restock History Log */}
      <GlassCard className="border-charcoal space-y-4">
        <h3 className="font-bold text-slate/60 text-sm flex items-center gap-2">
          <History className="w-4 h-4 text-cyan-400" /> Supplier Restock Audit History
        </h3>
        <div className="space-y-2 text-xs">
          {logs.length === 0 ? (
            <p className="text-slate/80 italic">No restock logs recorded yet.</p>
          ) : (
            logs.slice(0, 5).map((l, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-charcoal/60 border border-charcoal flex justify-between items-center">
                <div>
                  <span className="font-bold text-white">{l.product_name}</span>
                  <span className="text-[10px] text-slate/80 block">Supplier: {l.supplier_name}</span>
                </div>
                <div className="text-right">
                  <span className="text-emerald-400 font-bold font-mono">+{l.quantity_added} units</span>
                  <span className="text-[10px] text-slate/80 block">{new Date(l.restocked_at || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </GlassCard>

      {/* Restock Modal */}
      {showRestockModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/70 backdrop-blur-md">
          <div className="glass-card max-w-md w-full rounded-3xl p-6 relative border border-charcoal shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">Restock Product</h3>
            <p className="text-xs text-indigo-400 font-mono mb-4">{selectedProduct.name}</p>

            <form onSubmit={handleRestockSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-slate/60 font-medium block mb-1">Quantity to Add</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={restockQty}
                  onChange={(e) => setRestockQty(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-charcoal border border-charcoal text-white font-mono text-base"
                />
              </div>

              <div>
                <label className="text-slate/60 font-medium block mb-1">Supplier Name</label>
                <input
                  type="text"
                  required
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-charcoal border border-charcoal text-white"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="gradient-btn-primary py-3 rounded-xl font-bold text-xs flex-1">
                  Confirm Restock
                </button>
                <button
                  type="button"
                  onClick={() => setShowRestockModal(false)}
                  className="px-5 py-3 rounded-xl bg-charcoal text-slate/60 text-xs font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;



