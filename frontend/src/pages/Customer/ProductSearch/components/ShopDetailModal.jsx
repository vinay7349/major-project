import React from 'react';
import { X, MapPin, Phone, Star, Store, Clock, PackageCheck, UserCheck } from 'lucide-react';

const ShopDetailModal = ({ shop, products = [], onClose }) => {
  if (!shop) return null;

  const shopProducts = products.filter(
    (p) => p.shop_name === shop.name || p.shop === shop.id || shop.id === 1 // Display products associated or catalog sample
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-fade-scale">
      <div className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-900/95 p-6 sm:p-8 shadow-2xl text-white my-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Shop Header Banner */}
        <div className="flex items-start gap-4 pb-6 border-b border-white/10">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 text-white font-bold text-xl shadow-lg">
            <Store className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-2xl font-bold tracking-tight text-white">{shop.name}</h2>
              <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-300 border border-cyan-500/20">
                {shop.category || 'General Store'}
              </span>
              {shop.is_open !== false ? (
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Open Now
                </span>
              ) : (
                <span className="rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-400 border border-rose-500/20">
                  Closed
                </span>
              )}
            </div>

            <div className="mt-2 flex items-center gap-4 text-xs text-slate-300 flex-wrap">
              <span className="flex items-center gap-1 text-amber-400 font-semibold">
                <Star className="h-3.5 w-3.5 fill-amber-400" /> {shop.rating || '4.8'} ⭐
              </span>
              {shop.distance_km && (
                <span className="flex items-center gap-1 text-slate-300">
                  <MapPin className="h-3.5 w-3.5 text-cyan-400" /> {shop.distance_km} km away
                </span>
              )}
              {shop.owner_name && (
                <span className="flex items-center gap-1 text-slate-400">
                  <UserCheck className="h-3.5 w-3.5 text-indigo-400" /> Owner: {shop.owner_name}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Address & Contact Info */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs">
          <div className="flex items-start gap-2.5">
            <MapPin className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-200">Location & Address</p>
              <p className="mt-0.5 text-slate-400 leading-normal">{shop.address || 'Market Street, Sector 4'}</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Phone className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-200">Contact Number</p>
              <p className="mt-0.5 text-slate-400 font-mono">{shop.phone || '+1 (555) 234-5678'}</p>
            </div>
          </div>
        </div>

        {/* Available Products at this Shop */}
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-base font-bold text-white">
              <PackageCheck className="h-4 w-4 text-cyan-400" />
              <span>Products Available at {shop.name}</span>
            </h3>
            <span className="text-xs text-slate-400">{shopProducts.length} items</span>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {shopProducts.slice(0, 6).map((item) => (
              <div key={item.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3">
                <img
                  src={item.image_url || item.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=150&q=80'}
                  alt={item.name}
                  className="h-12 w-12 rounded-lg object-cover shrink-0 bg-slate-950 border border-white/10"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-white truncate">{item.name}</p>
                  <p className="text-[11px] text-cyan-300 font-bold">₹{Number(item.price || 0).toFixed(2)}</p>
                  <p className="text-[10px] text-emerald-400">✓ {(item.stock_quantity ?? 10) > 0 ? `${item.stock_quantity} available` : 'In Stock'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDetailModal;
