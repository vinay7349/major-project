import React from 'react';
import { X, SlidersHorizontal, RefreshCw, Star } from 'lucide-react';

const ProductFilters = ({
  isOpen,
  onClose,
  categories = [],
  shops = [],
  selectedCategory,
  setSelectedCategory,
  onlyInStock,
  setOnlyInStock,
  maxPrice,
  setMaxPrice,
  selectedShop,
  setSelectedShop,
  minRating,
  setMinRating,
  onReset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm animate-fade-left">
      <div className="relative w-full max-w-md bg-slate-900 border-l border-white/10 p-6 shadow-2xl text-white flex flex-col justify-between h-full overflow-hidden">
        <div className="min-h-0 flex-1 overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-cyan-400" />
              <h3 className="text-lg font-bold text-white">Filter Products</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-6 space-y-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md'
                      : 'bg-white/[0.05] border border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id || cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                      selectedCategory === cat.name
                        ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md'
                        : 'bg-white/[0.05] border border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Max Price Range
                </label>
                <span className="text-xs font-bold text-cyan-300">₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                step="1"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>₹1</span>
                <span>₹25</span>
                <span>₹50+</span>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-3.5">
              <div>
                <p className="text-xs font-semibold text-white">In-Stock Items Only</p>
                <p className="text-[10px] text-slate-400">Hide products currently out of stock</p>
              </div>
              <button
                onClick={() => setOnlyInStock(!onlyInStock)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  onlyInStock ? 'bg-cyan-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    onlyInStock ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {setMinRating && (
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Minimum Store/Product Rating
                </label>
                <div className="flex items-center gap-2">
                  {[0, 4.0, 4.5, 4.8].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setMinRating(rating)}
                      className={`flex-1 rounded-xl py-2 text-xs font-semibold border transition-all flex items-center justify-center gap-1 ${
                        minRating === rating
                          ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300'
                          : 'border-white/10 bg-white/[0.05] text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      {rating === 0 ? 'All' : <><Star className="h-3 w-3 fill-amber-400 text-amber-400" /><span>{rating}+</span></>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {shops.length > 0 && (
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Filter by Nearby Shop
                </label>
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950">
                  <div className="space-y-1.5 p-2">
                    <button
                      type="button"
                      onClick={() => setSelectedShop('all')}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-colors ${
                        selectedShop === 'all'
                          ? 'bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-500/30'
                          : 'text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      <span>All Nearby Shops</span>
                    </button>
                    {shops.map((s) => (
                      <button
                        key={s.id || s.name}
                        type="button"
                        onClick={() => setSelectedShop(s.name)}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-colors ${
                          selectedShop === s.name
                            ? 'bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-500/30'
                            : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <span className="truncate">{s.name}</span>
                        <span className="ml-2 shrink-0 text-[10px] text-slate-400">{s.distance_km || 1.0} km</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex items-center gap-3">
          <button
            onClick={onReset}
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] py-3 px-4 text-xs font-semibold text-slate-300 hover:bg-white/10 transition-all flex-1"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reset Filters</span>
          </button>
          <button
            onClick={onClose}
            className="rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 py-3 px-4 text-xs font-semibold text-white hover:from-cyan-400 hover:to-indigo-500 transition-all shadow-md flex-1"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
