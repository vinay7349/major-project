import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  MapPin,
  Phone,
  Star,
  Store,
  Clock,
  Navigation,
  Heart,
  ShoppingCart,
  ArrowLeft,
  MessageSquare,
  Sparkles,
  Send,
  AlertCircle,
  CheckCircle2,
  Package,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/NotificationContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { communityAPI } from '../services/api';

/**
 * ShopProfileView / ShopDetailDrawer
 * Production-ready shop profile displaying:
 * - Shop info, open/closed, address, contact, rating
 * - Contact / Directions
 * - Follow / Save
 * - Dynamic product categories
 * - Products from this shop (with stock, price, details, cart, save)
 * - Latest from this shop (community posts)
 * - Customer feedback & comments
 */
const ShopDetailDrawer = ({
  shop,
  products = [],
  onClose,
  onSelectProduct,
  onFollowShop,
  isFollowed = false,
}) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { addToCart } = useCart();
  const { toggleSave, savedItems } = useWishlist();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [followed, setFollowed] = useState(isFollowed);
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'updates' | 'comments'
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  // Filter products for this shop
  const shopProducts = useMemo(() => {
    if (!shop) return [];
    return products.filter(
      (p) =>
        String(p.shop_id) === String(shop.id) ||
        String(p.shop) === String(shop.id) ||
        (p.shop_name && shop.name && p.shop_name.toLowerCase() === shop.name.toLowerCase())
    );
  }, [shop, products]);

  // Extract dynamic categories from the shop's products
  const categories = useMemo(() => {
    const set = new Set();
    shopProducts.forEach((p) => {
      const cat = p.category_name || (typeof p.category === 'string' ? p.category : p.category?.name);
      if (cat) set.add(cat);
    });
    return ['All', ...Array.from(set)];
  }, [shopProducts]);

  // Filter products by selected category
  const visibleProducts = useMemo(() => {
    if (selectedCategory === 'All') return shopProducts;
    return shopProducts.filter((p) => {
      const cat = p.category_name || (typeof p.category === 'string' ? p.category : p.category?.name);
      return cat === selectedCategory;
    });
  }, [shopProducts, selectedCategory]);

  // Fetch latest updates and comments for this shop
  useEffect(() => {
    if (!shop) return;
    let mounted = true;
    const fetchShopFeed = async () => {
      setLoadingPosts(true);
      try {
        const res = await communityAPI.getPosts().catch(() => null);
        if (mounted && res?.data) {
          const list = res.data.results || res.data || [];
          const matched = list.filter(
            (item) => String(item.shop) === String(shop.id) || item.shop_name === shop.name
          );
          setPosts(matched);
        }
      } catch (err) {
        console.warn('Could not load shop posts', err);
      } finally {
        if (mounted) setLoadingPosts(false);
      }
    };
    fetchShopFeed();
    return () => {
      mounted = false;
    };
  }, [shop]);

  if (!shop) return null;

  const handleFollow = () => {
    if (!isAuthenticated) {
      toast.info('Please sign in to follow this store');
      navigate('/customer/login', { state: { from: location.pathname + location.search } });
      return;
    }
    const next = !followed;
    setFollowed(next);
    toast.success(next ? `Following ${shop.name}` : `Unfollowed ${shop.name}`);
    if (onFollowShop) onFollowShop(shop.id, next);
  };

  const handleDirections = () => {
    const destination = shop.lat && shop.lng
      ? `${shop.lat},${shop.lng}`
      : encodeURIComponent(shop.address ? `${shop.name}, ${shop.address}` : shop.name);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}`, '_blank', 'noopener,noreferrer');
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!isAuthenticated) {
      toast.info('Please sign in to leave feedback or ask a question');
      navigate('/customer/login', { state: { from: location.pathname + location.search } });
      return;
    }

    setSubmittingComment(true);
    try {
      const res = await communityAPI.createPost({
        shop: shop.id,
        body: commentText.trim(),
        author_name: user?.first_name || user?.username || 'Shopper',
      });
      if (res?.data) {
        setPosts((prev) => [res.data, ...prev]);
        setCommentText('');
        toast.success('Your message was posted to the shop profile');
      }
    } catch (err) {
      toast.error('Unable to send message right now. Please retry.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const isOpen = shop.is_open !== false;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="relative flex flex-col w-full sm:max-w-4xl max-h-[95vh] sm:max-h-[90vh] rounded-t-3xl sm:rounded-2xl border border-stone-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden text-slate-900 dark:text-slate-100">
        
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-slate-800 bg-stone-50/80 dark:bg-slate-900/90">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to discovery
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:bg-stone-200 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close store profile"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable content container */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          
          {/* Shop Hero Card */}
          <div className="rounded-2xl border border-stone-200 bg-stone-50/50 p-6 dark:border-slate-800 dark:bg-slate-900/50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="rounded-md bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-800 dark:text-amber-300 border border-amber-500/20">
                    {shop.category || 'Local Retail'}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-xs font-medium ${
                      isOpen
                        ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300'
                        : 'bg-stone-100 text-stone-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${isOpen ? 'bg-emerald-600 dark:bg-emerald-400' : 'bg-stone-400'}`} />
                    {isOpen ? 'Open for shopping' : 'Currently Closed'}
                  </span>
                  {shop.distance_km != null && (
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      • {Number(shop.distance_km).toFixed(1)} km away
                    </span>
                  )}
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {shop.name}
                </h1>
                {shop.owner_name && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Operated by {shop.owner_name}
                  </p>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={handleFollow}
                  className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-semibold border transition-all ${
                    followed
                      ? 'border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300'
                      : 'border-stone-200 bg-white text-slate-700 hover:border-stone-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${followed ? 'fill-rose-500 text-rose-500' : ''}`} />
                  {followed ? 'Following Shop' : 'Follow Shop'}
                </button>
                <button
                  onClick={handleDirections}
                  className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-amber-500 dark:text-slate-950 dark:hover:bg-amber-400 transition-colors"
                >
                  <Navigation className="h-4 w-4" /> Get Directions
                </button>
              </div>
            </div>

            {/* Address & Contact Row */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-stone-200/80 dark:border-slate-800 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Street Address:</span>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                    {shop.address || 'Address provided upon request'}
                  </p>
                </div>
              </div>

              {shop.phone && (
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Store Contact:</span>
                    <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                      <a href={`tel:${shop.phone}`} className="hover:underline">
                        {shop.phone}
                      </a>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-stone-200 dark:border-slate-800 pb-2">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'products'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Package className="h-4 w-4" /> Store Products ({shopProducts.length})
            </button>
            <button
              onClick={() => setActiveTab('updates')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'updates'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Sparkles className="h-4 w-4" /> Latest Updates ({posts.length})
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'comments'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <MessageSquare className="h-4 w-4" /> Customer Feedback
            </button>
          </div>

          {/* TAB 1: PRODUCTS & DYNAMIC CATEGORIES */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              {/* Dynamic Categories */}
              {categories.length > 1 && (
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                        selectedCategory === cat
                          ? 'bg-slate-900 text-white dark:bg-stone-100 dark:text-slate-900'
                          : 'bg-stone-100 text-slate-600 hover:bg-stone-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}

              {/* Product Grid */}
              {visibleProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                  {visibleProducts.map((product) => {
                    const isSaved = savedItems?.some((p) => p.id === product.id);
                    const inStock = (product.stock_quantity ?? 10) > 0;

                    return (
                      <div
                        key={product.id}
                        onClick={() => onSelectProduct && onSelectProduct(product, shop)}
                        className="group flex flex-col justify-between rounded-xl border border-stone-200 bg-white p-3.5 shadow-sm hover:border-stone-300 hover:shadow transition-all dark:border-slate-800 dark:bg-slate-900 cursor-pointer"
                      >
                        <div>
                          {/* Image or clean placeholder */}
                          <div className="relative h-32 w-full overflow-hidden rounded-lg bg-stone-100 dark:bg-slate-800 flex items-center justify-center">
                            {product.image_url || product.image ? (
                              <img
                                src={product.image_url || product.image}
                                alt={product.name}
                                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.style.display = 'none';
                                }}
                              />
                            ) : (
                              <Package className="h-8 w-8 text-stone-300 dark:text-slate-600" />
                            )}
                            <span
                              className={`absolute top-2 left-2 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                                inStock
                                  ? 'bg-emerald-600/90 text-white'
                                  : 'bg-stone-800/90 text-stone-200'
                              }`}
                            >
                              {inStock ? 'In Stock' : 'Sold Out'}
                            </span>
                          </div>

                          <h4 className="mt-2.5 font-bold text-xs text-slate-900 dark:text-white line-clamp-1 group-hover:text-amber-700 dark:group-hover:text-amber-400">
                            {product.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {product.category_name || (typeof product.category === 'string' ? product.category : product.category?.name) || 'General'}
                          </p>
                        </div>

                        <div className="mt-3 flex items-center justify-between pt-2 border-t border-stone-100 dark:border-slate-800">
                          <div>
                            {product.price != null ? (
                              <span className="font-bold text-sm text-slate-900 dark:text-white">
                                ₹{Number(product.price).toFixed(2)}
                              </span>
                            ) : (
                              <span className="text-[11px] text-slate-400">Price on inquiry</span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!isAuthenticated) {
                                  toast.info('Sign in to save items to wishlist');
                                  navigate('/customer/login', { state: { from: location.pathname + location.search } });
                                  return;
                                }
                                toggleSave(product);
                                toast.success(isSaved ? 'Removed from wishlist' : 'Saved to wishlist');
                              }}
                              className={`p-1.5 rounded-lg border transition-colors ${
                                isSaved
                                  ? 'border-rose-300 bg-rose-50 text-rose-600 dark:border-rose-900 dark:bg-rose-950/30'
                                  : 'border-stone-200 text-slate-500 hover:text-slate-900 dark:border-slate-700 dark:text-slate-400'
                              }`}
                              title={isSaved ? 'Remove from wishlist' : 'Save item'}
                            >
                              <Heart className={`h-3.5 w-3.5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!isAuthenticated) {
                                  toast.info('Sign in to add items to your cart');
                                  navigate('/customer/login', { state: { from: location.pathname + location.search } });
                                  return;
                                }
                                addToCart(product);
                                toast.success('Added to cart');
                              }}
                              className="flex items-center gap-1 rounded-lg bg-amber-500 px-2.5 py-1.5 text-[11px] font-bold text-slate-950 hover:bg-amber-400 transition-colors"
                            >
                              <ShoppingCart className="h-3.5 w-3.5" /> Add
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 text-center rounded-2xl border border-dashed border-stone-200 dark:border-slate-800">
                  <Package className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600" />
                  <p className="mt-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                    No products cataloged for this category
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: LATEST FROM THIS SHOP */}
          {activeTab === 'updates' && (
            <div className="space-y-3">
              {loadingPosts ? (
                <p className="text-xs text-slate-400 py-6 text-center">Checking store bulletins...</p>
              ) : posts.length > 0 ? (
                posts.map((post) => (
                  <div
                    key={post.id}
                    className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {post.author_name || 'Store Manager'}
                      </span>
                      <span>
                        {post.created_at ? new Date(post.created_at).toLocaleDateString() : 'Recent update'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {post.body}
                    </p>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center rounded-2xl border border-dashed border-stone-200 dark:border-slate-800">
                  <Sparkles className="mx-auto h-7 w-7 text-slate-300 dark:text-slate-600" />
                  <p className="mt-2 text-xs text-slate-500">No announcements posted by this shop yet.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: COMMENTS & FEEDBACK */}
          {activeTab === 'comments' && (
            <div className="space-y-4">
              {/* Comment submission form */}
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Ask the store a question or leave customer feedback..."
                  className="flex-1 rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-amber-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
                <button
                  type="submit"
                  disabled={submittingComment || !commentText.trim()}
                  className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-amber-500 dark:text-slate-950 dark:hover:bg-amber-400 disabled:opacity-50 transition-colors"
                >
                  <Send className="h-3.5 w-3.5" /> Post
                </button>
              </form>

              {/* Feed of comments */}
              <div className="space-y-2.5 pt-2">
                {posts.length > 0 ? (
                  posts.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-stone-200 bg-stone-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-900/60 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-slate-500">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {item.author_name || 'Customer'}
                        </span>
                        <span className="text-[10px]">
                          {item.created_at ? new Date(item.created_at).toLocaleDateString() : ''}
                        </span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300">{item.body}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 py-6 text-center">
                    No customer comments yet. Be the first to ask a question!
                  </p>
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default ShopDetailDrawer;
