import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Heart,
  MapPin,
  Package,
  ShoppingCart,
  Star,
  Store,
  Trash2,
} from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { useToast } from '../../../context/NotificationContext';
import { useWishlist } from '../../../context/WishlistContext';

const SavedPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { savedItems, savedShops, toggleSave, toggleSaveShop } = useWishlist();
  const { addToCart } = useCart();

  const formatPrice = (value) => `₹${Number(value || 0).toFixed(2)}`;
  const getStock = (item) => {
    const stock = Number(item.stock_quantity);
    return Number.isFinite(stock) && stock >= 0 ? stock : null;
  };

  const handleMoveToCart = (item) => {
    const stock = getStock(item);
    if (stock !== null && stock <= 0) {
      toast.error(`${item.name || 'This item'} is currently unavailable`);
      return;
    }
    addToCart(item);
    toggleSave(item);
    toast.success(`${item.name || 'Item'} moved to cart`);
  };

  const handleRemoveProduct = (item) => {
    toggleSave(item);
    toast.info(`${item.name || 'Item'} removed from saved items`);
  };

  const handleRemoveShop = (shop) => {
    toggleSaveShop(shop);
    toast.info(`${shop.name || 'Shop'} removed from saved shops`);
  };

  const handleViewShop = (shop) => {
    navigate(`/customer?q=${encodeURIComponent(shop.name || '')}`);
  };

  return (
    <div className="min-h-screen bg-warmwhite pb-16 text-navy transition-colors dark:bg-navy dark:text-slate/60">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-amber dark:text-amber-300">Customer account</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-navy dark:text-white sm:text-3xl">Saved for later</h1>
            <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate dark:text-slate/80">
              Products and local shops you have saved while exploring nearby availability.
            </p>
          </div>
          <NavLink
            to="/customer"
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-charcoal px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-charcoal dark:bg-amber dark:text-slate-950 dark:hover:bg-amber-400"
          >
            Browse nearby shops
            <ArrowRight className="h-4 w-4" />
          </NavLink>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-warmwhite/60 bg-white p-4 dark:border-charcoal dark:bg-charcoal">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red/10 text-red dark:text-rose-300">
                <Heart className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-navy dark:text-white">Saved products</p>
                <p className="mt-0.5 text-[11px] text-slate dark:text-slate/80">{savedItems.length} {savedItems.length === 1 ? 'item' : 'items'}</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-warmwhite/60 bg-white p-4 dark:border-charcoal dark:bg-charcoal">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber/10 text-amber dark:text-amber-300">
                <Store className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-navy dark:text-white">Saved shops</p>
                <p className="mt-0.5 text-[11px] text-slate dark:text-slate/80">{savedShops.length} {savedShops.length === 1 ? 'shop' : 'shops'}</p>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-extrabold text-navy dark:text-white">Saved products</h2>
              <p className="mt-1 text-xs text-slate dark:text-slate/80">Move an available item to your cart when you are ready.</p>
            </div>
            <span className="rounded-full bg-red/10 px-3 py-1 text-[10px] font-bold text-red dark:text-rose-300">{savedItems.length} saved</span>
          </div>

          {savedItems.length === 0 ? (
            <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-warmwhite/60 bg-white/70 p-8 text-center dark:border-charcoal dark:bg-charcoal/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-warmwhite text-slate/80 dark:bg-charcoal">
                <Package className="h-6 w-6" />
              </div>
              <p className="mt-4 text-sm font-bold text-navy dark:text-white">No products saved yet</p>
              <p className="mt-1 max-w-sm text-xs leading-relaxed text-slate dark:text-slate/80">Save products from discovery to keep them here for a later visit.</p>
              <NavLink to="/customer" className="mt-4 inline-flex items-center gap-2 rounded-xl border border-warmwhite/60 px-4 py-2.5 text-xs font-bold text-charcoal transition-colors hover:border-amber hover:text-amber dark:border-charcoal dark:text-slate/60 dark:hover:border-amber dark:hover:text-amber-300">
                Find products
                <ArrowRight className="h-4 w-4" />
              </NavLink>
            </div>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {savedItems.map((item) => {
                const stock = getStock(item);
                const inStock = stock === null || stock > 0;
                return (
                  <article key={item.id} className="flex flex-col overflow-hidden rounded-2xl border border-warmwhite/60 bg-white shadow-sm transition-colors dark:border-charcoal dark:bg-charcoal">
                    <div className="relative aspect-[4/3] bg-warmwhite dark:bg-charcoal">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name || 'Saved product'} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-slate/80">
                          <Package className="h-10 w-10" />
                        </div>
                      )}
                      <div className="absolute left-3 top-3 flex items-center gap-2">
                        <span className={`rounded-md px-2 py-1 text-[10px] font-bold ${inStock ? 'bg-mutedgreen/90 text-white' : 'bg-charcoal/90 text-white'}`}>
                          {inStock ? 'Available' : 'Unavailable'}
                        </span>
                        {item.category_name && <span className="rounded-md bg-white/90 px-2 py-1 text-[10px] font-semibold text-charcoal shadow-sm dark:bg-charcoal/90 dark:text-slate/60">{item.category_name}</span>}
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-amber dark:text-amber-300">{item.brand || 'Local product'}</p>
                        <h3 className="mt-1 line-clamp-2 text-sm font-extrabold text-navy dark:text-white">{item.name || 'Untitled product'}</h3>
                        <p className="mt-1 flex items-center gap-1 text-[11px] text-slate dark:text-slate/80">
                          <Store className="h-3 w-3 shrink-0" />
                          <span className="truncate">{item.shop_name || 'Local shop'}</span>
                        </p>
                      </div>
                      <div className="mt-4 flex items-end justify-between gap-3">
                        <div>
                          <p className="text-base font-extrabold text-navy dark:text-white">{formatPrice(item.price)}</p>
                          {stock !== null && (
                            <p className={`mt-0.5 flex items-center gap-1 text-[10px] font-semibold ${stock <= 5 ? 'text-amber dark:text-amber-300' : 'text-slate/80 dark:text-slate'}`}>
                              {stock <= 5 ? <AlertCircle className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                              {stock <= 5 ? `Only ${stock} left` : `${stock} available`}
                            </p>
                          )}
                        </div>
                        <div className="flex shrink-0 items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleMoveToCart(item)}
                            disabled={!inStock}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-amber px-3 py-2 text-[11px] font-bold text-slate-950 transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40 dark:text-white"
                          >
                            <ShoppingCart className="h-3.5 w-3.5" />
                            Move to cart
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveProduct(item)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-warmwhite/60 text-slate/80 transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-red dark:border-charcoal dark:hover:border-rose-900 dark:hover:bg-red/20 dark:hover:text-rose-300"
                            aria-label={`Remove ${item.name || 'product'} from saved items`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="mt-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-extrabold text-navy dark:text-white">Saved shops</h2>
              <p className="mt-1 text-xs text-slate dark:text-slate/80">Return to a local shop and explore its current catalog.</p>
            </div>
            <span className="rounded-full bg-amber/10 px-3 py-1 text-[10px] font-bold text-amber dark:text-amber-300">{savedShops.length} saved</span>
          </div>

          {savedShops.length === 0 ? (
            <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-warmwhite/60 bg-white/70 p-8 text-center dark:border-charcoal dark:bg-charcoal/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-warmwhite text-slate/80 dark:bg-charcoal">
                <Store className="h-6 w-6" />
              </div>
              <p className="mt-4 text-sm font-bold text-navy dark:text-white">No shops saved yet</p>
              <p className="mt-1 max-w-sm text-xs leading-relaxed text-slate dark:text-slate/80">Follow a shop from discovery to keep its profile here.</p>
              <NavLink to="/customer" className="mt-4 inline-flex items-center gap-2 rounded-xl border border-warmwhite/60 px-4 py-2.5 text-xs font-bold text-charcoal transition-colors hover:border-amber hover:text-amber dark:border-charcoal dark:text-slate/60 dark:hover:border-amber dark:hover:text-amber-300">
                Explore shops
                <ArrowRight className="h-4 w-4" />
              </NavLink>
            </div>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {savedShops.map((shop) => (
                <article key={shop.id} className="flex flex-col rounded-2xl border border-warmwhite/60 bg-white p-5 shadow-sm transition-colors dark:border-charcoal dark:bg-charcoal">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber/10 text-amber dark:text-amber-300">
                      <Store className="h-5 w-5" />
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${shop.is_open === false ? 'bg-warmwhite text-slate dark:bg-charcoal dark:text-slate/80' : 'bg-mutedgreen/10 text-mutedgreen dark:text-emerald-300'}`}>
                      {shop.is_open === false ? 'Closed' : 'Open'}
                    </span>
                  </div>
                  <h3 className="mt-4 line-clamp-2 text-base font-extrabold text-navy dark:text-white">{shop.name || 'Local shop'}</h3>
                  <p className="mt-1 text-[11px] font-semibold text-amber dark:text-amber-300">{shop.category || 'Local retail'}</p>
                  <div className="mt-4 space-y-2 text-xs text-slate dark:text-slate/80">
                    <p className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-amber dark:text-amber-300" />
                      <span className="truncate">{shop.address || 'Address not provided'}</span>
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="flex items-center gap-1 font-semibold text-charcoal dark:text-slate/60">
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber" />
                        {shop.rating ?? 'Not rated'}
                      </span>
                      {shop.distance_km != null && <span className="font-semibold text-charcoal dark:text-slate/60">{Number(shop.distance_km).toFixed(1)} km</span>}
                    </div>
                  </div>
                  <div className="mt-5 flex items-center gap-2 border-t border-warmwhite/60 pt-4 dark:border-charcoal">
                    <button
                      type="button"
                      onClick={() => handleViewShop(shop)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-charcoal px-3 py-2.5 text-[11px] font-bold text-white transition-colors hover:bg-charcoal dark:bg-amber dark:text-slate-950 dark:hover:bg-amber-400"
                    >
                      View products
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveShop(shop)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-warmwhite/60 text-slate/80 transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-red dark:border-charcoal dark:hover:border-rose-900 dark:hover:bg-red/20 dark:hover:text-rose-300"
                      aria-label={`Remove ${shop.name || 'shop'} from saved shops`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default SavedPage;



