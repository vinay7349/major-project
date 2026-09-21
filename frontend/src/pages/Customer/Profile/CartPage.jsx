import React, { useMemo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Heart,
  MapPin,
  Minus,
  Package,
  Plus,
  ShoppingCart,
  Store,
  Trash2,
} from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { useToast } from '../../../context/NotificationContext';
import { useWishlist } from '../../../context/WishlistContext';

const CartPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { cartItems, incrementQuantity, decrementQuantity, removeFromCart, clearCart } = useCart();
  const { savedItems, toggleSave } = useWishlist();

  const formatPrice = (value) => `₹${Number(value || 0).toFixed(2)}`;
  const getStock = (item) => {
    const stock = Number(item.stock_quantity);
    return Number.isFinite(stock) && stock >= 0 ? stock : null;
  };

  const cartGroups = useMemo(() => {
    const groups = new Map();
    cartItems.forEach((item) => {
      const shopName = item.shop_name || 'Local shop';
      const key = item.shop_id != null ? `id:${item.shop_id}` : `name:${shopName}`;
      const existing = groups.get(key);
      if (existing) {
        existing.items.push(item);
        existing.total += Number(item.price || 0) * (Number(item.quantity) || 1);
      } else {
        groups.set(key, {
          key,
          shopName,
          shopId: item.shop_id || item.shop || null,
          shopAddress: item.shop_address || item.address || null,
          shopRating: item.shop_rating ?? item.rating ?? null,
          shopDistanceKm: item.shop_distance_km ?? item.distance_km ?? null,
          items: [item],
          total: Number(item.price || 0) * (Number(item.quantity) || 1),
        });
      }
    });
    return Array.from(groups.values());
  }, [cartItems]);

  const cartCount = cartItems.reduce((total, item) => total + (Number(item.quantity) || 1), 0);
  const cartTotal = cartItems.reduce((total, item) => total + Number(item.price || 0) * (Number(item.quantity) || 1), 0);

  const handleSaveForLater = (item) => {
    const isSaved = savedItems.some((savedItem) => String(savedItem.id) === String(item.id));
    if (!isSaved) toggleSave(item);
    removeFromCart(item.id);
    toast.info(`${item.name || 'Item'} saved for later`);
  };

  const handleClearCart = () => {
    clearCart();
    toast.info('Cart cleared');
  };

  return (
    <div className="min-h-screen bg-warmwhite pb-16 text-navy transition-colors dark:bg-navy dark:text-slate/60">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-amber dark:text-amber-300">Customer account</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-navy dark:text-white sm:text-3xl">Your cart</h1>
            <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate dark:text-slate/80">
              Review available products from local shops before you continue.
            </p>
          </div>
          <NavLink
            to="/customer"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-warmwhite/60 px-4 py-2.5 text-xs font-bold text-charcoal transition-colors hover:border-amber hover:text-amber dark:border-charcoal dark:text-slate/60 dark:hover:border-amber dark:hover:text-amber-300"
          >
            Continue browsing
            <ArrowRight className="h-4 w-4" />
          </NavLink>
        </div>

        {cartItems.length === 0 ? (
          <div className="mt-8 flex flex-col items-center justify-center rounded-3xl border border-dashed border-warmwhite/60 bg-white/70 p-10 text-center dark:border-charcoal dark:bg-charcoal/50">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber/10 text-amber dark:text-amber-300">
              <ShoppingCart className="h-7 w-7" />
            </div>
            <h2 className="mt-5 text-lg font-extrabold text-navy dark:text-white">Your cart is empty</h2>
            <p className="mt-2 max-w-sm text-xs leading-relaxed text-slate dark:text-slate/80">Add available products from nearby shops and they will appear here with quantity and shop details.</p>
            <NavLink to="/customer" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-charcoal px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-charcoal dark:bg-amber dark:text-slate-950 dark:hover:bg-amber-400">
              Explore nearby products
              <ArrowRight className="h-4 w-4" />
            </NavLink>
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
              <div className="space-y-5">
                {cartGroups.map((group) => (
                  <section key={group.key} className="overflow-hidden rounded-3xl border border-warmwhite/60 bg-white shadow-sm dark:border-charcoal dark:bg-charcoal">
                    <header className="flex flex-col gap-3 border-b border-warmwhite/60 bg-warmwhite/70 p-5 dark:border-charcoal dark:bg-charcoal/40 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber/10 text-amber dark:text-amber-300">
                          <Store className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <h2 className="truncate text-sm font-extrabold text-navy dark:text-white">{group.shopName}</h2>
                          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate dark:text-slate/80">
                            <MapPin className="h-3 w-3" />
                            {group.items.length} {group.items.length === 1 ? 'product' : 'products'} from this shop
                          </p>
                          {group.shopAddress && (
                            <p className="mt-1 flex items-center gap-1 text-[10px] text-slate/80 dark:text-slate">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate">{group.shopAddress}</span>
                              {group.shopDistanceKm != null && <span>• {Number(group.shopDistanceKm).toFixed(1)} km</span>}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="text-sm font-extrabold text-navy dark:text-white">{formatPrice(group.total)}</span>
                    </header>

                    <div className="divide-y divide-stone-100 dark:divide-slate-800">
                      {group.items.map((item) => {
                        const stock = getStock(item);
                        const quantity = Number(item.quantity) || 1;
                        const inStock = stock === null || stock > 0;
                        const exceedsStock = stock !== null && quantity > stock;
                        return (
                          <article key={item.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-warmwhite dark:bg-charcoal sm:h-28 sm:w-28">
                              {item.image_url ? (
                                <img src={item.image_url} alt={item.name || 'Cart product'} className="h-full w-full object-cover" />
                              ) : (
                                <div className="flex h-full items-center justify-center text-slate/80">
                                  <Package className="h-8 w-8" />
                                </div>
                              )}
                              <span className={`absolute left-2 top-2 rounded-md px-2 py-1 text-[9px] font-bold ${inStock ? 'bg-mutedgreen/90 text-white' : 'bg-charcoal/90 text-white'}`}>
                                {inStock ? 'Available' : 'Unavailable'}
                              </span>
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <h3 className="line-clamp-2 text-sm font-extrabold text-navy dark:text-white">{item.name || 'Untitled product'}</h3>
                                  <p className="mt-1 text-[11px] text-slate dark:text-slate/80">{item.brand || item.category_name || 'Local product'}</p>
                                </div>
                                <p className="shrink-0 text-sm font-extrabold text-navy dark:text-white">{formatPrice(item.price)}</p>
                              </div>
                              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px]">
                                {stock !== null && (
                                  <span className={`flex items-center gap-1 font-semibold ${stock <= 5 ? 'text-amber dark:text-amber-300' : 'text-slate dark:text-slate/80'}`}>
                                    {stock <= 5 ? <AlertCircle className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                                    {stock <= 5 ? `Only ${stock} left` : `${stock} available`}
                                  </span>
                                )}
                                {exceedsStock && (
                                  <span className="flex items-center gap-1 font-semibold text-red dark:text-rose-300">
                                    <AlertCircle className="h-3 w-3" />
                                    Quantity exceeds current stock
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-end justify-between gap-3 sm:flex-col sm:items-stretch sm:justify-center">
                              <div className="flex items-center rounded-xl border border-warmwhite/60 bg-warmwhite dark:border-charcoal dark:bg-charcoal">
                                <button
                                  type="button"
                                  onClick={() => decrementQuantity(item.id)}
                                  disabled={quantity <= 1}
                                  className="flex h-9 w-9 items-center justify-center text-slate transition-colors hover:text-navy disabled:cursor-not-allowed disabled:opacity-30 dark:text-slate/80 dark:hover:text-white"
                                  aria-label={`Decrease quantity of ${item.name || 'product'}`}
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="w-8 text-center text-xs font-extrabold text-navy dark:text-white">{quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => incrementQuantity(item.id)}
                                  disabled={!inStock || (stock !== null && quantity >= stock)}
                                  className="flex h-9 w-9 items-center justify-center text-slate transition-colors hover:text-navy disabled:cursor-not-allowed disabled:opacity-30 dark:text-slate/80 dark:hover:text-white"
                                  aria-label={`Increase quantity of ${item.name || 'product'}`}
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleSaveForLater(item)}
                                  className="flex h-9 items-center gap-1 rounded-xl border border-warmwhite/60 px-2.5 text-[10px] font-bold text-slate transition-colors hover:border-amber hover:text-amber dark:border-charcoal dark:text-slate/60 dark:hover:border-amber dark:hover:text-amber-300"
                                >
                                  <Heart className="h-3.5 w-3.5" />
                                  Save
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeFromCart(item.id)}
                                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-warmwhite/60 text-slate/80 transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-red dark:border-charcoal dark:hover:border-rose-900 dark:hover:bg-red/20 dark:hover:text-rose-300"
                                  aria-label={`Remove ${item.name || 'product'} from cart`}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>

              <aside className="space-y-4 lg:sticky lg:top-24">
                <section className="rounded-3xl border border-warmwhite/60 bg-white p-6 shadow-sm dark:border-charcoal dark:bg-charcoal">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-extrabold uppercase tracking-wider text-amber dark:text-amber-300">Order summary</p>
                      <h2 className="mt-1 text-lg font-extrabold text-navy dark:text-white">Cart total</h2>
                    </div>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber/10 text-amber dark:text-amber-300">
                      <ShoppingCart className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-6 space-y-3 text-xs">
                    <div className="flex items-center justify-between text-slate dark:text-slate/80">
                      <span>Items</span>
                      <span className="font-bold text-navy dark:text-white">{cartCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate dark:text-slate/80">
                      <span>Shops</span>
                      <span className="font-bold text-navy dark:text-white">{cartGroups.length}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-warmwhite/60 pt-3 text-sm dark:border-charcoal">
                      <span className="font-bold text-charcoal dark:text-slate/60">Estimated total</span>
                      <span className="font-extrabold text-navy dark:text-white">{formatPrice(cartTotal)}</span>
                    </div>
                  </div>
                  <p className="mt-4 rounded-xl bg-warmwhite p-3 text-[11px] leading-relaxed text-slate dark:bg-charcoal/50 dark:text-slate/80">
                    Prices and availability reflect the product information stored in your cart. Confirm final availability with each local shop.
                  </p>
                  <button
                    type="button"
                    onClick={handleClearCart}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-bold text-red transition-colors hover:bg-rose-100 dark:border-rose-900/50 dark:bg-red/20 dark:text-rose-300 dark:hover:bg-red/40"
                  >
                    <Trash2 className="h-4 w-4" />
                    Clear cart
                  </button>
                </section>

                <section className="rounded-3xl border border-emerald-200/70 bg-emerald-50/70 p-5 dark:border-emerald-900/40 dark:bg-mutedgreen/20">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-mutedgreen dark:text-emerald-300" />
                    <div>
                      <p className="text-xs font-extrabold text-mutedgreen dark:text-emerald-200">Cart saved on this device</p>
                      <p className="mt-1 text-[11px] leading-relaxed text-mutedgreen/80 dark:text-emerald-300/80">Your cart remains available in this browser while you continue exploring.</p>
                    </div>
                  </div>
                </section>
              </aside>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default CartPage;



