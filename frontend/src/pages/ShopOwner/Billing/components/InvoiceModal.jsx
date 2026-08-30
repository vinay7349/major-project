import React from 'react';
import { X, Printer, Download, CheckCircle2 } from 'lucide-react';

const InvoiceModal = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
      <div className="glass-card max-w-2xl w-full rounded-3xl p-8 max-h-[90vh] overflow-y-auto relative border border-slate-700/50 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-200 rounded-full hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Invoice Header */}
        <div className="flex justify-between items-start border-b border-slate-700/50 pb-6 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                G
              </div>
              <h2 className="text-xl font-bold text-slate-100">ShopGenie AI</h2>
            </div>
            <p className="text-xs text-slate-400">Intelligent Retail & POS Solutions</p>
            <p className="text-xs text-slate-400">742 Evergreen Terrace, Springfield</p>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" /> PAID IN FULL
            </span>
            <h3 className="text-lg font-bold font-mono text-slate-200">#{order.order_number}</h3>
            <p className="text-xs text-slate-400">{new Date(order.created_at || Date.now()).toLocaleString()}</p>
          </div>
        </div>

        {/* Customer & Cashier Info */}
        <div className="grid grid-cols-2 gap-4 mb-6 p-4 rounded-2xl bg-slate-800/40 border border-slate-700/40 text-xs">
          <div>
            <span className="text-slate-400 block mb-1">Billed To:</span>
            <p className="font-semibold text-slate-200">{order.customer_name || 'Walk-in Customer'}</p>
            <p className="text-slate-400">{order.customer_phone || 'N/A'}</p>
          </div>
          <div className="text-right">
            <span className="text-slate-400 block mb-1">Payment Method:</span>
            <p className="font-semibold text-slate-200">{order.payment_method || 'CASH'}</p>
            <p className="text-slate-400">Cashier: {order.cashier_name || 'Admin'}</p>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full text-left text-xs mb-6">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400">
              <th className="pb-3 font-semibold">Item Description</th>
              <th className="pb-3 font-semibold text-center">Qty</th>
              <th className="pb-3 font-semibold text-right">Price</th>
              <th className="pb-3 font-semibold text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {(order.items || []).map((item, idx) => (
              <tr key={idx}>
                <td className="py-3 font-medium text-slate-200">{item.product_name}</td>
                <td className="py-3 text-center">{item.quantity}</td>
                <td className="py-3 text-right">${parseFloat(item.unit_price).toFixed(2)}</td>
                <td className="py-3 text-right font-semibold">${parseFloat(item.total_price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-between items-end border-t border-slate-700/50 pt-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-20 h-20 bg-white p-2 rounded-xl flex items-center justify-center shadow-inner">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Invoice-${order.order_number}`}
                alt="QR Code"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-[10px] text-slate-400 max-w-[120px] leading-tight">
              Scan QR code to verify receipt authenticity
            </span>
          </div>

          <div className="w-64 space-y-1.5 text-xs text-right">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal:</span>
              <span>${parseFloat(order.subtotal || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Tax (8%):</span>
              <span>${parseFloat(order.tax_amount || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Discount:</span>
              <span>-${parseFloat(order.discount_amount || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-indigo-400 border-t border-slate-700/50 pt-2">
              <span>Total Paid:</span>
              <span>${parseFloat(order.total_amount || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handlePrint}
            className="flex-1 gradient-btn-primary py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-medium"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice</span>
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
