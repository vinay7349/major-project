import React, { useEffect, useState } from 'react';
import { Search, Plus, Minus, Trash2, Camera, Receipt, CreditCard, QrCode, CheckCircle2, History } from 'lucide-react';
import { billingAPI, productsAPI } from '../../../services/api';
import GlassCard from '../../../components/GlassCard';
import InvoiceModal from '../../../components/InvoiceModal';
import BarcodeScannerModal from '../../../components/BarcodeScannerModal';
import { useToast } from '../../../context/NotificationContext';

const BillingPage = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [discount, setDiscount] = useState(0);
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await productsAPI.getAll();
      setProducts(res.data.results || res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await billingAPI.getOrders();
      setOrders(res.data.results || res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product_id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product_id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          product_id: product.id,
          product_name: product.name,
          unit_price: parseFloat(product.price),
          quantity: 1,
        },
      ];
    });
  };

  const updateCartQty = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product_id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const subtotal = cart.reduce((acc, item) => acc + item.unit_price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = Math.max(0, subtotal + tax - parseFloat(discount || 0));

  const handleCheckout = async () => {
    if (cart.length === 0) {
      addToast('Cart is empty. Add products before completing order.', 'error');
      return;
    }

    try {
      const orderPayload = {
        customer_name: customerName,
        customer_phone: customerPhone,
        items: cart,
        tax_amount: tax,
        discount_amount: discount,
        payment_method: paymentMethod,
      };

      const res = await billingAPI.createOrder(orderPayload);
      addToast(`Invoice #${res.data.order_number} generated successfully!`, 'success');
      setActiveInvoice(res.data);
      setShowInvoiceModal(true);

      // Reset Cart
      setCart([]);
      setCustomerName('Walk-in Customer');
      setCustomerPhone('');
      setDiscount(0);
      fetchOrders();
      fetchProducts();
    } catch (err) {
      console.error(err);
      addToast('Error processing checkout order', 'error');
    }
  };

  const handleBarcodeScanned = (code) => {
    const matched = products.find((p) => p.barcode === code || p.sku === code);
    if (matched) {
      addToCart(matched);
      addToast(`Added ${matched.name} to checkout cart!`, 'success');
    } else {
      addToast(`No product matched barcode: ${code}`, 'error');
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      (p.barcode && p.barcode.includes(search))
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">
            Smart Billing System & POS Terminal
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            Barcode scanning, live total calculations, and QR invoice generation.
          </p>
        </div>

        <button
          onClick={() => setShowScanner(true)}
          className="gradient-btn-primary px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2"
        >
          <Camera className="w-4 h-4 text-cyan-300" /> Live Barcode Scanner
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Product Selector */}
        <div className="lg:col-span-7 space-y-4">
          <GlassCard className="p-4 space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search items by name, SKU or barcode to add..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto pr-1">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => addToCart(p)}
                  className="p-3 rounded-2xl bg-slate-900/60 hover:bg-indigo-600/20 border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <img
                      src={p.image_url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80'}
                      alt={p.name}
                      className="w-full h-24 object-cover rounded-xl mb-2"
                    />
                    <h4 className="font-bold text-slate-100 text-xs truncate group-hover:text-indigo-400 transition-colors">
                      {p.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-mono">{p.sku}</p>
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-800">
                    <span className="font-bold font-mono text-cyan-400 text-xs">${parseFloat(p.price).toFixed(2)}</span>
                    <span className="text-[10px] text-slate-400">{p.stock_quantity} left</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Right: Checkout Cart & Order Calculation */}
        <div className="lg:col-span-5 space-y-4">
          <GlassCard className="space-y-4 border-slate-800">
            <h3 className="font-bold text-slate-100 text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-indigo-400" /> Current Order Cart
              </span>
              <span className="text-xs font-mono text-indigo-400">{cart.length} Items</span>
            </h3>

            {/* Cart Items List */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1 text-xs">
              {cart.length === 0 ? (
                <p className="text-slate-400 italic text-center py-8">Cart is empty. Select products on left.</p>
              ) : (
                cart.map((item) => (
                  <div key={item.product_id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-200">{item.product_name}</h4>
                      <p className="text-[10px] text-slate-400 font-mono">${item.unit_price.toFixed(2)} each</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1">
                        <button onClick={() => updateCartQty(item.product_id, -1)} className="p-1 hover:text-rose-400">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono font-bold px-2">{item.quantity}</span>
                        <button onClick={() => updateCartQty(item.product_id, 1)} className="p-1 hover:text-indigo-400">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="font-bold font-mono text-cyan-400 min-w-[50px] text-right">
                        ${(item.unit_price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <input
                type="text"
                placeholder="Customer Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
              />
            </div>

            {/* Payment Method */}
            <div>
              <label className="text-[11px] text-slate-400 font-medium block mb-1.5">Payment Method</label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {['CASH', 'CARD', 'UPI'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`py-2 rounded-xl font-bold border transition-all ${
                      paymentMethod === method
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {/* Subtotal Calculations */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="font-mono">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tax (8%)</span>
                <span className="font-mono">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Discount ($)</span>
                <input
                  type="number"
                  min="0"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="w-20 px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-right font-mono text-white"
                />
              </div>
              <div className="flex justify-between text-base font-extrabold text-cyan-400 border-t border-slate-800 pt-2">
                <span>Total Amount</span>
                <span className="font-mono">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className="w-full gradient-btn-primary py-3.5 rounded-2xl font-bold text-sm shadow-xl flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Complete Sale & Generate Invoice</span>
            </button>
          </GlassCard>
        </div>
      </div>

      {/* Orders History Table */}
      <GlassCard className="border-slate-800 space-y-4">
        <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
          <History className="w-4 h-4 text-cyan-400" /> Recent Sales History & Invoices
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/60 border-b border-slate-800 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="p-3">Invoice #</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Total Paid</th>
                <th className="p-3">Date</th>
                <th className="p-3 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {orders.slice(0, 8).map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-mono font-bold text-indigo-400">#{ord.order_number}</td>
                  <td className="p-3 text-slate-200">{ord.customer_name}</td>
                  <td className="p-3 font-semibold text-xs">{ord.payment_method}</td>
                  <td className="p-3 font-mono font-bold text-cyan-400">${parseFloat(ord.total_amount).toFixed(2)}</td>
                  <td className="p-3 text-slate-400">{new Date(ord.created_at || Date.now()).toLocaleDateString()}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => {
                        setActiveInvoice(ord);
                        setShowInvoiceModal(true);
                      }}
                      className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
                    >
                      View Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Modals */}
      <BarcodeScannerModal
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onScanSuccess={handleBarcodeScanned}
      />

      <InvoiceModal
        order={activeInvoice}
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
      />
    </div>
  );
};

export default BillingPage;
