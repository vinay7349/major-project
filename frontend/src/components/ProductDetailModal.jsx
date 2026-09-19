import React from 'react';
import {
  X,
  Store,
  CheckCircle2,
  AlertCircle,
  Tag,
  Barcode,
  MapPin,
  Phone,
  Heart,
  ShoppingCart,
  ArrowRight,
  Package,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/NotificationContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * ProductDetailModal:
 * Requirements:
 * - Product image
 * - Name
 * - Brand / Category
 * - Price only when provided
 * - Availability
 * - Current shop
 * - More from this shop
 * - Save / Cart with auth check
 */
const ProductDetailModal = ({
  product,
  shop,
  onClose,
  onViewShop,
  allProducts = [],
  onSelectProduct,
}) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { addToCart } = useCart();
  const { toggleSave, savedItems } = useWishlist();

  if (!product) return null;

  const isSaved = savedItems?.some((p) => p.id === product.id);
  const stockQuantity = product.stock_quantity;
  const inStock = stockQuantity == null ? true : Number(stockQuantity) > 0;
  const lowStock = stockQuantity != null && Number(stockQuantity) > 0 && Number(stockQuantity) <= 5;

  // More products from the same shop
  const moreFromShop = allProducts
    .filter(
      (p) =>
        p.id !== product.id &&
        (String(p.shop_id) === String(product.shop_id || shop?.id) ||
          String(p.shop) === String(product.shop || shop?.id))
    )
    .slice(0, 4);

  const handleSave = () => {
    if (!isAuthenticated) {
      toast.info('Please sign in to save items to your wishlist');
      navigate('/customer/login', { state: { from: location.pathname + location.search } });
      return;
    }
    toggleSave(product);
    toast.success(isSaved ? 'Removed from wishlist' : 'Saved to wishlist');
  };

  const handleCart = () => {
    if (!isAuthenticated) {
      toast.info('Please sign in to add items to your cart');
      navigate('/customer/login', { state: { from: location.pathname + location.search } });
      return;
    }
    addToCart(product);
    toast.success(`Added ${product.name} to cart`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl border border-stone-200 bg-white p-5 sm:p-7 shadow-2xl dark:border-slate-800 dark:bg-slate-900 text-slate-900 dark:text-slate-100 my-8 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-xl text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close details"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Main Grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          
          {/* Image / Placeholder */}
          <div className="relative aspect-square w-full rounded-xl border border-stone-200 bg-stone-50 dark:border-slate-800 dark:bg-slate-800/80 flex items-center justify-center overflow-hidden">
            {product.image_url || product.image ? (
              <img
                src={product.image_url || product.image}
                alt={product.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div className="text-center p-4">
                <Package className="mx-auto h-12 w-12 text-stone-300 dark:text-slate-600" />
                <span className="mt-2 block text-xs text-slate-400">Local store item</span>
              </div>
            )}

            {/* Category badge */}
            <span className="absolute top-3 left-3 rounded-md bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-slate-700 shadow-sm backdrop-blur-md dark:bg-slate-900/90 dark:text-slate-300 border border-stone-200 dark:border-slate-700">
              {product.category_name || (typeof product.category === 'string' ? product.category : product.category?.name) || 'General'}
            </span>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-between space-y-4">
            <div>
              {/* Brand or Category */}
              {product.brand && (
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  {product.brand}
                </p>
              )}

              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                {product.name}
              </h2>

              {/* Price & Stock availability */}
              <div className="mt-3 flex items-baseline gap-3">
                {product.price != null ? (
                  <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    ₹{Number(product.price).toFixed(2)}
                  </span>
                ) : (
                  <span className="text-sm font-medium text-slate-500 italic">
                    Price available at store
                  </span>
                )}

                <span
                  className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ${
                    !inStock
                      ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400'
                      : lowStock
                      ? 'bg-amber-500/10 text-amber-800 dark:text-amber-300'
                      : 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300'
                  }`}
                >
                  {!inStock ? (
                    <>
                      <AlertCircle className="h-3.5 w-3.5" /> Out of stock
                    </>
                  ) : lowStock ? (
                    <>
                      <AlertCircle className="h-3.5 w-3.5" /> Only {stockQuantity} left
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" /> In stock ({stockQuantity ?? 'Available'})
                    </>
                  )}
                </span>
              </div>

              {/* Description */}
              {product.description && (
                <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  {product.description}
                </p>
              )}

              {/* SKU / Barcode */}
              {(product.sku || product.barcode) && (
                <div className="mt-3 flex items-center gap-3 text-[11px] text-slate-400">
                  {product.sku && <span>SKU: {product.sku}</span>}
                  {product.barcode && <span>Barcode: {product.barcode}</span>}
                </div>
              )}
            </div>

            {/* Actions: Save / Add to Cart */}
            <div className="pt-3 border-t border-stone-100 dark:border-slate-800 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleSave}
                  className={`flex items-center justify-center gap-1.5 rounded-xl border py-2.5 px-3 text-xs font-semibold transition-colors ${
                    isSaved
                      ? 'border-rose-300 bg-rose-50 text-rose-600 dark:border-rose-900 dark:bg-rose-950/30'
                      : 'border-stone-200 text-slate-700 hover:bg-stone-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                  {isSaved ? 'Saved' : 'Save'}
                </button>
                <button
                  onClick={handleCart}
                  disabled={!inStock}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 py-2.5 px-3 text-xs font-bold text-slate-950 hover:bg-amber-400 disabled:opacity-50 transition-colors"
                >
                  <ShoppingCart className="h-4 w-4" /> Add to Cart
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Current Shop Section */}
        {shop && (
          <div className="mt-6 rounded-xl border border-stone-200 bg-stone-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Available At Local Store
                </span>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">
                  {shop.name}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1 mt-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  {shop.address || 'Local neighborhood store'}
                  {shop.distance_km != null && ` • ${Number(shop.distance_km).toFixed(1)} km away`}
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onViewShop && onViewShop(shop);
                }}
                className="shrink-0 flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline pt-1"
              >
                View Store Profile <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* More From This Shop Section */}
        {moreFromShop.length > 0 && (
          <div className="mt-6 pt-4 border-t border-stone-100 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
              More from {shop?.name || 'this store'}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {moreFromShop.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectProduct && onSelectProduct(item, shop)}
                  className="rounded-lg border border-stone-200 bg-white p-2 text-left hover:border-stone-300 cursor-pointer dark:border-slate-800 dark:bg-slate-800/50"
                >
                  <div className="h-16 w-full rounded bg-stone-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                    {item.image_url || item.image ? (
                      <img src={item.image_url || item.image} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <Package className="h-5 w-5 text-stone-300 dark:text-slate-600" />
                    )}
                  </div>
                  <p className="mt-1 font-semibold text-[11px] text-slate-900 dark:text-white truncate">
                    {item.name}
                  </p>
                  {item.price != null ? (
                    <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                      ₹{Number(item.price).toFixed(2)}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetailModal;
