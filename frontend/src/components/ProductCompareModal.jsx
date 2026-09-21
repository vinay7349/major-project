import React from 'react';
import { X, Check, Trash2, ArrowLeftRight, Store, Tag, Package, Star } from 'lucide-react';

const ProductCompareModal = ({ compareProducts, onRemove, onClear, onClose }) => {
  if (!compareProducts || compareProducts.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-navy/85 backdrop-blur-md animate-fade-scale">
      <div className="relative w-full max-w-4xl rounded-3xl border border-white/10 bg-charcoal/95 p-6 sm:p-8 shadow-2xl text-white my-8 max-h-[90vh] overflow-y-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber/10 text-cyan-400 border border-amber/20">
              <ArrowLeftRight className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Compare Products</h2>
              <p className="text-xs text-slate/80">Side-by-side specs, price & availability analysis</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClear}
              className="flex items-center gap-1.5 rounded-xl border border-red/30 bg-red/10 px-3 py-1.5 text-xs text-rose-300 hover:bg-red/20 transition-all"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear All</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 text-slate/60 hover:bg-white/20 hover:text-white transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Comparison Table Grid */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-white/10">
                <th className="p-3 font-semibold text-slate/80 w-32">Attribute</th>
                {compareProducts.map((product) => (
                  <th key={product.id} className="p-3 font-bold text-white min-w-[200px] align-top">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-semibold truncate">{product.name}</span>
                      <button
                        onClick={() => onRemove(product.id)}
                        className="text-slate hover:text-rose-400 p-1"
                        title="Remove product"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <img
                      src={product.image_url || product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80'}
                      alt={product.name}
                      className="h-28 w-full rounded-xl object-cover border border-white/10 bg-navy"
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {/* Price */}
              <tr>
                <td className="p-3 font-semibold text-slate/80">Price</td>
                {compareProducts.map((p) => (
                  <td key={p.id} className="p-3 font-extrabold text-base text-cyan-300">
                    ₹{Number(p.price || 0).toFixed(2)}
                  </td>
                ))}
              </tr>

              {/* Category */}
              <tr>
                <td className="p-3 font-semibold text-slate/80">Category</td>
                {compareProducts.map((p) => (
                  <td key={p.id} className="p-3 text-slate/60">
                    <span className="inline-flex items-center gap-1 rounded-full bg-charcoal px-2 py-0.5 text-[11px]">
                      <Tag className="h-3 w-3 text-cyan-400" />
                      {p.category_name || p.category || 'General'}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Availability / Stock */}
              <tr>
                <td className="p-3 font-semibold text-slate/80">Availability</td>
                {compareProducts.map((p) => {
                  const inStock = (p.stock_quantity ?? 10) > 0;
                  return (
                    <td key={p.id} className="p-3">
                      {inStock ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                          <Check className="h-3.5 w-3.5" /> {p.stock_quantity ? `${p.stock_quantity} available` : 'In Stock'}
                        </span>
                      ) : (
                        <span className="text-rose-400 font-semibold">Out of Stock</span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Shop Name */}
              <tr>
                <td className="p-3 font-semibold text-slate/80">Nearby Shop</td>
                {compareProducts.map((p) => (
                  <td key={p.id} className="p-3 text-slate/60">
                    <span className="inline-flex items-center gap-1">
                      <Store className="h-3.5 w-3.5 text-indigo-400" />
                      {p.shop_name || 'Genie Retailer'}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Rating */}
              <tr>
                <td className="p-3 font-semibold text-slate/80">Rating</td>
                {compareProducts.map((p) => (
                  <td key={p.id} className="p-3 text-amber-400 font-semibold">
                    ⭐ {p.rating || '4.8'} / 5.0
                  </td>
                ))}
              </tr>

              {/* Description */}
              <tr>
                <td className="p-3 font-semibold text-slate/80">Description</td>
                {compareProducts.map((p) => (
                  <td key={p.id} className="p-3 text-slate/80 text-[11px] leading-normal">
                    {p.description || 'Premium local product available near you.'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductCompareModal;



