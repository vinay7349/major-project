import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import {
  MapPin,
  Crosshair,
  Map as MapIcon,
  Search,
  SlidersHorizontal,
  ArrowRight,
  ArrowLeft,
  Store,
  Clock,
  Star,
  Package,
  Navigation,
  Heart,
  ShoppingCart,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  X,
  ChevronDown,
  Phone,
  Sparkles,
  Send,
  ExternalLink,
  Tag,
  Share2,
} from 'lucide-react';
import { productsAPI, communityAPI } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/NotificationContext';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import { useLocationContext } from '../../../context/LocationContext';
import { PREVIEW_SHOPS, PREVIEW_PRODUCTS } from '../../../mock/discoveryPreviewData';
import MapDrawer from '../../../components/MapDrawer';

const PRESET_AREAS = [
  'Market Street, Sector 4',
  'Old Harbor Dockside',
  'Downtown Plaza',
  'Commercial Square',
  'Tech Boulevard',
];

const RADIUS_OPTIONS = [1, 2, 5];

export default function ProductDiscoveryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { toggleSave, savedItems } = useWishlist();
  const { lat, lng, radius, areaName, setLocation, setRadius } = useLocationContext();

  // Data state
  const [shops, setShops] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState('preview'); // 'api' | 'preview'

  // Navigation & Active Views state
  // null = Discovery Home; object = Shop Profile View
  const [selectedShop, setSelectedShop] = useState(null);
  // null = closed; object = Product Details Modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [mapOpen, setMapOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [customAreaInput, setCustomAreaInput] = useState('');

  // Shop Profile Internal State
  const [shopSearch, setShopSearch] = useState('');
  const [shopActiveCategory, setShopActiveCategory] = useState('All');
  const [followedShops, setFollowedShops] = useState({});

  // Global Search state
  const globalSearchQuery = searchParams.get('q') || '';
  const [localSearch, setLocalSearch] = useState(globalSearchQuery);

  useEffect(() => {
    setLocalSearch(globalSearchQuery);
  }, [globalSearchQuery]);

  // Load Data: tries Django backend first; falls back cleanly to isolated preview data
  const loadDiscoveryData = async () => {
    setLoading(true);
    try {
      const [shopsRes, productsRes] = await Promise.all([
        communityAPI.getNearbyShops().catch(() => null),
        productsAPI.getAll().catch(() => null),
      ]);

      const fetchedShops = shopsRes?.data?.results || shopsRes?.data;
      const fetchedProducts = productsRes?.data?.results || productsRes?.data;

      if (Array.isArray(fetchedShops) && fetchedShops.length > 0) {
        setShops(fetchedShops);
        setProducts(Array.isArray(fetchedProducts) ? fetchedProducts : []);
        setDataSource('api');
      } else {
        // Fall back cleanly to isolated preview data
        setShops(PREVIEW_SHOPS);
        setProducts(PREVIEW_PRODUCTS);
        setDataSource('preview');
      }
    } catch (err) {
      setShops(PREVIEW_SHOPS);
      setProducts(PREVIEW_PRODUCTS);
      setDataSource('preview');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDiscoveryData();
  }, []);

  // Location handlers
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      toast.info('Geolocation is not supported by your browser');
      return;
    }
    toast.info('Detecting current GPS location...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation(pos.coords.latitude, pos.coords.longitude, 'Current Location');
        toast.success('Location updated via GPS');
        setLocationModalOpen(false);
      },
      (err) => {
        console.warn('GPS error:', err);
        toast.error('Unable to retrieve GPS coordinates. Please select an area manually.');
      },
      { timeout: 8000 }
    );
  };

  const handleSelectArea = (area) => {
    setLocation(null, null, area);
    toast.success(`Discovery area updated to ${area}`);
    setLocationModalOpen(false);
  };

  const handleCustomAreaSubmit = (e) => {
    e.preventDefault();
    if (!customAreaInput.trim()) return;
    setLocation(null, null, customAreaInput.trim());
    toast.success(`Location set to ${customAreaInput.trim()}`);
    setCustomAreaInput('');
    setLocationModalOpen(false);
  };

  // Auth-gated Follow
  const handleToggleFollow = (shop) => {
    if (!isAuthenticated) {
      toast.info('Please sign in to follow this store');
      navigate('/customer/login', { state: { from: location.pathname + location.search } });
      return;
    }
    const next = !followedShops[shop.id];
    setFollowedShops((prev) => ({ ...prev, [shop.id]: next }));
    toast.success(next ? `Following ${shop.name}` : `Unfollowed ${shop.name}`);
  };

  // Auth-gated Save (Wishlist)
  const handleSaveProduct = (product, e) => {
    if (e) e.stopPropagation();
    if (!isAuthenticated) {
      toast.info('Please sign in to save items to your wishlist');
      navigate('/customer/login', { state: { from: location.pathname + location.search } });
      return;
    }
    toggleSave(product);
    const isSaved = savedItems.some((p) => p.id === product.id);
    toast.success(isSaved ? 'Removed from wishlist' : 'Saved to wishlist');
  };

  // Auth-gated Cart
  const handleAddToCart = (product, e) => {
    if (e) e.stopPropagation();
    if (!isAuthenticated) {
      toast.info('Please sign in to add items to your cart');
      navigate('/customer/login', { state: { from: location.pathname + location.search } });
      return;
    }
    addToCart(product);
    toast.success(`Added ${product.name} to cart`);
  };

  // Search submit
  const handleGlobalSearchSubmit = (e) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearchParams({ q: localSearch.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleClearGlobalSearch = () => {
    setLocalSearch('');
    setSearchParams({});
  };

  // Directions
  const openDirections = (shop, e) => {
    if (e) e.stopPropagation();
    const destination = shop.lat && shop.lng
      ? `${shop.lat},${shop.lng}`
      : encodeURIComponent(shop.address ? `${shop.name}, ${shop.address}` : shop.name);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}`, '_blank', 'noopener,noreferrer');
  };

  // Compute products count per shop
  const shopProductCounts = useMemo(() => {
    const counts = {};
    products.forEach((p) => {
      const sId = p.shop_id || p.shop;
      if (sId) counts[sId] = (counts[sId] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Nearby Shops filtered by radius
  const nearbyShops = useMemo(() => {
    return shops
      .map((s) => ({
        ...s,
        product_count: s.product_count ?? shopProductCounts[s.id] ?? 0,
      }))
      .filter((s) => {
        if (s.distance_km == null) return true;
        return Number(s.distance_km) <= radius;
      })
      .sort((a, b) => (a.distance_km || 99) - (b.distance_km || 99));
  }, [shops, radius, shopProductCounts]);

  // Closest to you shop
  const closestShop = nearbyShops[0] || null;
  const otherShops = nearbyShops.slice(1);

  // Global search filters
  const matchingShops = useMemo(() => {
    if (!globalSearchQuery.trim()) return [];
    const q = globalSearchQuery.toLowerCase().trim();
    return shops.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) ||
        s.category?.toLowerCase().includes(q) ||
        s.address?.toLowerCase().includes(q)
    );
  }, [shops, globalSearchQuery]);

  const matchingProducts = useMemo(() => {
    if (!globalSearchQuery.trim()) return [];
    const q = globalSearchQuery.toLowerCase().trim();
    return products.filter((p) => {
      const matchName = p.name?.toLowerCase().includes(q);
      const matchCategory =
        p.category_name?.toLowerCase().includes(q) ||
        (typeof p.category === 'string' && p.category.toLowerCase().includes(q));
      const matchBrand = p.brand?.toLowerCase().includes(q);
      return matchName || matchCategory || matchBrand;
    });
  }, [products, globalSearchQuery]);

  // Products belonging to currently selected shop
  const currentShopProducts = useMemo(() => {
    if (!selectedShop) return [];
    return products.filter(
      (p) =>
        String(p.shop_id) === String(selectedShop.id) ||
        String(p.shop) === String(selectedShop.id) ||
        (p.shop_name && selectedShop.name && p.shop_name.toLowerCase() === selectedShop.name.toLowerCase())
    );
  }, [selectedShop, products]);

  // Dynamic category tabs for selected shop
  const shopCategories = useMemo(() => {
    const cats = new Set();
    currentShopProducts.forEach((p) => {
      const c = p.category_name || (typeof p.category === 'string' ? p.category : p.category?.name);
      if (c) cats.add(c);
    });
    return ['All', ...Array.from(cats)];
  }, [currentShopProducts]);

  // Filter products within selected shop
  const filteredShopProducts = useMemo(() => {
    let list = currentShopProducts;
    if (shopActiveCategory !== 'All') {
      list = list.filter((p) => {
        const c = p.category_name || (typeof p.category === 'string' ? p.category : p.category?.name);
        return c === shopActiveCategory;
      });
    }
    if (shopSearch.trim()) {
      const q = shopSearch.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [currentShopProducts, shopActiveCategory, shopSearch]);

  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* GLOBAL DISCOVERY CONTROL BAR */}
      <section className="sticky top-[61px] z-30 border-b border-stone-200/90 bg-white/95 dark:border-slate-800 dark:bg-slate-900/95 backdrop-blur-md shadow-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            
            {/* Location Selector & GPS Action */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setLocationModalOpen(true)}
                className="flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 text-xs font-semibold text-slate-800 hover:border-amber-500/50 hover:bg-white transition-colors dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
                title="Change active location"
              >
                <MapPin className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span className="font-bold">{areaName || 'Market Street, Sector 4'}</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              <button
                onClick={handleUseMyLocation}
                className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-stone-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 transition-colors"
              >
                <Crosshair className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                <span>Use My Location</span>
              </button>

              {/* Data source indicator pill */}
              <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500 dark:bg-slate-800/80 dark:text-slate-400 border border-stone-200 dark:border-slate-700">
                {dataSource === 'preview' ? 'Preview Data Mode' : 'Connected to Local API'}
              </span>
            </div>

            {/* Radius Selector & Show Map Button */}
            <div className="flex items-center gap-3 self-end md:self-auto">
              {/* Radius Pills */}
              <div className="flex items-center gap-1 rounded-xl border border-stone-200 bg-stone-50 p-1 dark:border-slate-800 dark:bg-slate-800/60">
                <span className="px-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">
                  Radius
                </span>
                {RADIUS_OPTIONS.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setRadius(r);
                      toast.info(`Search perimeter set to ${r} km`);
                    }}
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                      radius === r
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                    }`}
                  >
                    {r} km
                  </button>
                ))}
              </div>

              {/* Show Map Toggle */}
              <button
                onClick={() => setMapOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-slate-800 dark:bg-amber-500 dark:text-slate-950 dark:hover:bg-amber-400 transition-colors"
              >
                <MapIcon className="h-4 w-4" />
                <span>Show Map</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* VIEWPORT BODY */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* ========================================================================= */}
        {/* VIEW 1: GLOBAL SEARCH RESULTS (Triggered when search query is active) */}
        {/* ========================================================================= */}
        {globalSearchQuery ? (
          <section className="space-y-8 animate-fade-in">
            {/* Results Title Bar */}
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-slate-800 pb-4">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Search results for "{globalSearchQuery}"
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Showing matches across nearby local shops and catalog products
                </p>
              </div>
              <button
                onClick={handleClearGlobalSearch}
                className="flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800 dark:text-amber-400 dark:hover:underline"
              >
                <X className="h-4 w-4" /> Clear Search
              </button>
            </div>

            {/* Matching Shops */}
            {matchingShops.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Matching Stores ({matchingShops.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {matchingShops.map((shop) => (
                    <div
                      key={shop.id}
                      onClick={() => setSelectedShop(shop)}
                      className="group flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-5 shadow-xs hover:border-stone-300 hover:shadow-md transition-all dark:border-slate-800 dark:bg-slate-900 cursor-pointer"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 pb-2">
                          <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-800 dark:text-amber-300 border border-amber-500/20">
                            {shop.category || 'Store'}
                          </span>
                          <span className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> {shop.rating}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-700 dark:text-white dark:group-hover:text-amber-400">
                          {shop.name}
                        </h3>
                        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span>{shop.address}</span>
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-stone-100 dark:border-slate-800 flex items-center justify-between text-xs">
                        <span className="font-semibold text-amber-600 dark:text-amber-400">
                          {shop.distance_km} km away
                        </span>
                        <button className="flex items-center gap-1 font-bold text-slate-900 dark:text-white group-hover:underline">
                          View Store <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Matching Products: Product -> Shop -> Price -> Availability -> Distance */}
            {matchingProducts.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Products Available Nearby ({matchingProducts.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {matchingProducts.map((prod) => {
                    const sellerShop = shops.find(
                      (s) => String(s.id) === String(prod.shop_id || prod.shop) || s.name === prod.shop_name
                    );
                    const isSaved = savedItems.some((p) => p.id === prod.id);
                    const inStock = prod.stock_quantity > 0;

                    return (
                      <div
                        key={prod.id}
                        onClick={() => setSelectedProduct(prod)}
                        className="group flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-4 shadow-xs hover:border-stone-300 hover:shadow-md transition-all dark:border-slate-800 dark:bg-slate-900 cursor-pointer"
                      >
                        <div>
                          {/* Image */}
                          <div className="relative aspect-square w-full rounded-xl bg-stone-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center">
                            {prod.image_url ? (
                              <img
                                src={prod.image_url}
                                alt={prod.name}
                                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <Package className="h-10 w-10 text-stone-300 dark:text-slate-600" />
                            )}
                            <span
                              className={`absolute top-2 left-2 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                                inStock ? 'bg-emerald-600 text-white' : 'bg-stone-800 text-stone-200'
                              }`}
                            >
                              {inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </div>

                          {/* Product & Brand */}
                          <div className="mt-3">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                              {prod.brand}
                            </span>
                            <h3 className="font-bold text-sm text-slate-900 group-hover:text-amber-700 dark:text-white dark:group-hover:text-amber-400 line-clamp-1">
                              {prod.name}
                            </h3>
                          </div>

                          {/* Attribution: Shop -> Distance */}
                          {sellerShop && (
                            <div className="mt-2.5 rounded-lg bg-stone-50 dark:bg-slate-800/60 p-2 text-xs flex items-center justify-between text-slate-600 dark:text-slate-300">
                              <span className="font-semibold truncate flex items-center gap-1">
                                <Store className="h-3 w-3 text-amber-600" /> {sellerShop.name}
                              </span>
                              <span className="shrink-0 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                                {sellerShop.distance_km} km
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Price & Actions */}
                        <div className="mt-4 pt-3 border-t border-stone-100 dark:border-slate-800 flex items-center justify-between">
                          <span className="font-extrabold text-base text-slate-900 dark:text-white">
                            ₹{Number(prod.price).toFixed(2)}
                          </span>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={(e) => handleSaveProduct(prod, e)}
                              className={`p-1.5 rounded-lg border transition-colors ${
                                isSaved
                                  ? 'border-rose-300 bg-rose-50 text-rose-600 dark:border-rose-900 dark:bg-rose-950/30'
                                  : 'border-stone-200 text-slate-500 hover:text-slate-900 dark:border-slate-700 dark:text-slate-400'
                              }`}
                              title={isSaved ? 'Remove from wishlist' : 'Save'}
                            >
                              <Heart className={`h-3.5 w-3.5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                            </button>
                            <button
                              onClick={(e) => handleAddToCart(prod, e)}
                              disabled={!inStock}
                              className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-400 disabled:opacity-50 transition-colors"
                            >
                              Add
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {matchingShops.length === 0 && matchingProducts.length === 0 && (
              <div className="py-16 text-center rounded-2xl border border-dashed border-stone-200 dark:border-slate-800">
                <Search className="mx-auto h-10 w-10 text-stone-300 dark:text-slate-600" />
                <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
                  No matches for "{globalSearchQuery}"
                </h3>
                <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                  Try searching for everyday items like "rice", "fish", "bread", "shirt", or store names.
                </p>
                <button
                  onClick={handleClearGlobalSearch}
                  className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white dark:bg-amber-500 dark:text-slate-950"
                >
                  Return to Discovery
                </button>
              </div>
            )}
          </section>
        ) : selectedShop ? (
          /* ========================================================================= */
          /* VIEW 2 & 3: SHOP PROFILE & SHOP PRODUCTS (When a shop is clicked) */
          /* ========================================================================= */
          <section className="space-y-8 animate-fade-in">
            {/* Top Navigation */}
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-slate-800 pb-4">
              <button
                onClick={() => {
                  setSelectedShop(null);
                  setShopSearch('');
                  setShopActiveCategory('All');
                }}
                className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Back to all nearby shops
              </button>
              <span className="text-xs text-slate-500">
                Viewing Store Profile • {selectedShop.name}
              </span>
            </div>

            {/* Shop Profile Banner Card */}
            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="rounded-md bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-800 dark:text-amber-300 border border-amber-500/20">
                      {selectedShop.category}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${
                        selectedShop.is_open !== false
                          ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300'
                          : 'bg-stone-100 text-stone-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${selectedShop.is_open !== false ? 'bg-emerald-600' : 'bg-stone-400'}`} />
                      {selectedShop.is_open !== false ? 'Open Now' : 'Closed'}
                    </span>
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> {selectedShop.rating}
                    </span>
                  </div>

                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {selectedShop.name}
                  </h1>

                  <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                    {selectedShop.description || 'Quality neighborhood store providing local retail products.'}
                  </p>

                  {/* Address, Distance, Phone */}
                  <div className="flex items-center gap-4 flex-wrap pt-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-amber-600" /> {selectedShop.address} ({selectedShop.distance_km} km away)
                    </span>
                    {selectedShop.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5 text-emerald-600" />
                        <a href={`tel:${selectedShop.phone}`} className="hover:underline">
                          {selectedShop.phone}
                        </a>
                      </span>
                    )}
                  </div>
                </div>

                {/* Direct Actions: Directions & Follow */}
                <div className="flex items-center gap-2.5 self-start md:self-center shrink-0">
                  <button
                    onClick={() => handleToggleFollow(selectedShop)}
                    className={`flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-xs font-semibold transition-all ${
                      followedShops[selectedShop.id]
                        ? 'border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300'
                        : 'border-stone-200 bg-white text-slate-700 hover:bg-stone-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${followedShops[selectedShop.id] ? 'fill-rose-500 text-rose-500' : ''}`} />
                    {followedShops[selectedShop.id] ? 'Following Store' : 'Follow Store'}
                  </button>
                  <button
                    onClick={(e) => openDirections(selectedShop, e)}
                    className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 dark:bg-amber-500 dark:text-slate-950 dark:hover:bg-amber-400 transition-colors"
                  >
                    <Navigation className="h-4 w-4" /> Get Directions
                  </button>
                </div>
              </div>

              {/* Latest From This Shop Bulletin */}
              {selectedShop.latest_update && (
                <div className="mt-5 rounded-2xl bg-amber-50/60 dark:bg-slate-800/60 border border-amber-200/60 dark:border-slate-700/60 p-3.5 flex items-start gap-2.5">
                  <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
                      Latest from this shop
                    </h4>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">
                      {selectedShop.latest_update}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* SHOP PRODUCTS SECTION */}
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Package className="h-4 w-4 text-amber-600" /> Products from {selectedShop.name} ({currentShopProducts.length})
                </h2>

                {/* Search within this store */}
                <div className="relative w-full sm:w-72">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={shopSearch}
                    onChange={(e) => setShopSearch(e.target.value)}
                    placeholder={`Search within ${selectedShop.name}...`}
                    className="h-9 w-full rounded-xl border border-stone-200 bg-white pl-9 pr-3 text-xs outline-none focus:border-amber-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Dynamic Category Tabs */}
              {shopCategories.length > 1 && (
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {shopCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setShopActiveCategory(cat)}
                      className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                        shopActiveCategory === cat
                          ? 'bg-slate-900 text-white dark:bg-stone-100 dark:text-slate-900'
                          : 'bg-white text-slate-600 hover:bg-stone-100 dark:bg-slate-800 dark:text-slate-300 border border-stone-200 dark:border-slate-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}

              {/* Products Grid */}
              {filteredShopProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredShopProducts.map((product) => {
                    const isSaved = savedItems.some((p) => p.id === product.id);
                    const inStock = product.stock_quantity > 0;
                    const isLowStock = inStock && product.stock_quantity <= 5;

                    return (
                      <div
                        key={product.id}
                        onClick={() => setSelectedProduct(product)}
                        className="group flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-4 shadow-xs hover:border-stone-300 hover:shadow-md transition-all dark:border-slate-800 dark:bg-slate-900 cursor-pointer"
                      >
                        <div>
                          {/* Image */}
                          <div className="relative aspect-square w-full rounded-xl bg-stone-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center">
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <Package className="h-10 w-10 text-stone-300 dark:text-slate-600" />
                            )}
                            <span
                              className={`absolute top-2 left-2 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                                !inStock
                                  ? 'bg-stone-800 text-stone-200'
                                  : isLowStock
                                  ? 'bg-amber-500 text-slate-950'
                                  : 'bg-emerald-600 text-white'
                              }`}
                            >
                              {!inStock ? 'Out of stock' : isLowStock ? `Low Stock (${product.stock_quantity})` : 'In Stock'}
                            </span>
                          </div>

                          <div className="mt-3">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                              {product.brand}
                            </span>
                            <h3 className="font-bold text-sm text-slate-900 group-hover:text-amber-700 dark:text-white dark:group-hover:text-amber-400 line-clamp-1">
                              {product.name}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                              {product.description}
                            </p>
                          </div>
                        </div>

                        {/* Price & Actions */}
                        <div className="mt-4 pt-3 border-t border-stone-100 dark:border-slate-800 flex items-center justify-between">
                          <span className="font-extrabold text-base text-slate-900 dark:text-white">
                            ₹{Number(product.price).toFixed(2)}
                          </span>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={(e) => handleSaveProduct(product, e)}
                              className={`p-1.5 rounded-lg border transition-colors ${
                                isSaved
                                  ? 'border-rose-300 bg-rose-50 text-rose-600 dark:border-rose-900 dark:bg-rose-950/30'
                                  : 'border-stone-200 text-slate-500 hover:text-slate-900 dark:border-slate-700 dark:text-slate-400'
                              }`}
                              title={isSaved ? 'Remove from wishlist' : 'Save'}
                            >
                              <Heart className={`h-3.5 w-3.5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                            </button>
                            <button
                              onClick={(e) => handleAddToCart(product, e)}
                              disabled={!inStock}
                              className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-400 disabled:opacity-50 transition-colors"
                            >
                              Add
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 text-center rounded-2xl border border-dashed border-stone-200 dark:border-slate-800">
                  <Package className="mx-auto h-8 w-8 text-stone-300 dark:text-slate-600" />
                  <p className="mt-2 text-xs font-semibold text-slate-500">
                    No products matched your filter in this store.
                  </p>
                </div>
              )}
            </div>

          </section>
        ) : (
          /* ========================================================================= */
          /* VIEW 1: DISCOVERY HOME (When no shop is selected and no search is active) */
          /* ========================================================================= */
          <div className="space-y-12 animate-fade-in">

            {/* SECTION: CLOSEST TO YOU */}
            {closestShop && (
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      Closest to you
                    </h2>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Within {radius} km search perimeter
                  </span>
                </div>

                {/* Featured Closest Shop Card */}
                <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-50/50 via-white to-stone-50/30 p-6 shadow-sm dark:border-amber-500/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="rounded-md bg-amber-500 text-slate-950 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider">
                          Nearest Store
                        </span>
                        <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-800 dark:text-amber-300 border border-amber-500/20">
                          {closestShop.category}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${
                            closestShop.is_open !== false
                              ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300'
                              : 'bg-stone-100 text-stone-600 dark:bg-slate-800 dark:text-slate-400'
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${closestShop.is_open !== false ? 'bg-emerald-600' : 'bg-stone-400'}`} />
                          {closestShop.is_open !== false ? 'Open Now' : 'Closed'}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-400">
                          <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                          {closestShop.rating}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-3">
                        <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                          {closestShop.name}
                        </h3>
                        <span className="text-sm font-extrabold text-amber-600 dark:text-amber-400">
                          {closestShop.distance_km} km away
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{closestShop.address}</span>
                      </p>

                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Store className="h-3.5 w-3.5 text-slate-400" />
                        <span>{closestShop.product_count} items cataloged in store</span>
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 sm:self-end md:self-center shrink-0">
                      <button
                        onClick={() => setSelectedShop(closestShop)}
                        className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 dark:bg-amber-500 dark:text-slate-950 dark:hover:bg-amber-400 transition-colors shadow-xs"
                      >
                        View Shop <ArrowRight className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => openDirections(closestShop, e)}
                        className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-stone-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-colors"
                      >
                        <Navigation className="h-3.5 w-3.5 text-slate-500" /> Directions
                      </button>
                      <button
                        onClick={() => handleToggleFollow(closestShop)}
                        className={`p-2.5 rounded-xl border transition-colors ${
                          followedShops[closestShop.id]
                            ? 'border-rose-300 bg-rose-50 text-rose-600 dark:border-rose-900 dark:bg-rose-950/30'
                            : 'border-stone-200 bg-white text-slate-500 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                        title={followedShops[closestShop.id] ? 'Unfollow store' : 'Follow store'}
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            followedShops[closestShop.id] ? 'fill-rose-500 text-rose-500' : ''
                          }`}
                        />
                      </button>
                    </div>

                  </div>
                </div>
              </section>
            )}

            {/* SECTION: SHOPS NEARBY (Grid) */}
            {otherShops.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Shops nearby ({otherShops.length})
                  </h2>
                  <span className="text-xs text-slate-500">Sorted by proximity</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {otherShops.map((shop) => (
                    <div
                      key={shop.id}
                      onClick={() => setSelectedShop(shop)}
                      className="group flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-5 shadow-xs hover:border-stone-300 hover:shadow-md transition-all dark:border-slate-800 dark:bg-slate-900 cursor-pointer"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 pb-2">
                          <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-800 dark:text-amber-300 border border-amber-500/20">
                            {shop.category}
                          </span>
                          <span className="flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-400">
                            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> {shop.rating}
                          </span>
                        </div>

                        <div className="mt-1 flex items-baseline justify-between gap-2">
                          <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-700 dark:text-white dark:group-hover:text-amber-400">
                            {shop.name}
                          </h3>
                          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 shrink-0">
                            {shop.distance_km} km
                          </span>
                        </div>

                        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1 line-clamp-2">
                          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span>{shop.address}</span>
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-stone-100 dark:border-slate-800">
                        <div className="flex items-center justify-between pb-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Store className="h-3.5 w-3.5 text-slate-400" />
                            {shop.product_count} products
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleFollow(shop);
                            }}
                            className={`flex items-center gap-1 text-xs font-semibold ${
                              followedShops[shop.id] ? 'text-rose-600' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                            }`}
                          >
                            <Heart className={`h-3.5 w-3.5 ${followedShops[shop.id] ? 'fill-rose-500 text-rose-500' : ''}`} />
                            {followedShops[shop.id] ? 'Following' : 'Follow'}
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setSelectedShop(shop)}
                            className="rounded-xl bg-slate-900 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-amber-500 dark:text-slate-950 dark:hover:bg-amber-400 transition-colors text-center"
                          >
                            View Shop
                          </button>
                          <button
                            onClick={(e) => openDirections(shop, e)}
                            className="rounded-xl border border-stone-200 py-2 text-xs font-semibold text-slate-700 hover:bg-stone-50 dark:border-slate-700 dark:text-slate-200 transition-colors flex items-center justify-center gap-1"
                          >
                            <Navigation className="h-3.5 w-3.5 text-slate-500" /> Directions
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </section>
            )}

            {nearbyShops.length === 0 && !loading && (
              <div className="py-16 text-center rounded-2xl border border-dashed border-stone-200 dark:border-slate-800 space-y-3">
                <Store className="mx-auto h-12 w-12 text-stone-300 dark:text-slate-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  No shops found within {radius} km
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Try expanding your search perimeter to 5 km or choose a different neighborhood area.
                </p>
                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    onClick={() => setRadius(5)}
                    className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors"
                  >
                    Expand to 5 km
                  </button>
                  <button
                    onClick={() => setLocationModalOpen(true)}
                    className="rounded-xl border border-stone-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-stone-50 dark:border-slate-700 dark:text-slate-200"
                  >
                    Change Area
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* VIEW 4: PRODUCT DETAILS MODAL */}
      {/* ========================================================================= */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl rounded-2xl border border-stone-200 bg-white p-5 sm:p-7 shadow-2xl dark:border-slate-800 dark:bg-slate-900 text-slate-900 dark:text-slate-100 max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute right-4 top-4 p-2 rounded-xl text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close details"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Product Details Grid */}
            <div className="grid gap-6 sm:grid-cols-2">
              
              {/* Image */}
              <div className="relative aspect-square w-full rounded-xl border border-stone-200 bg-stone-50 dark:border-slate-800 dark:bg-slate-800 overflow-hidden flex items-center justify-center">
                {selectedProduct.image_url ? (
                  <img
                    src={selectedProduct.image_url}
                    alt={selectedProduct.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Package className="h-12 w-12 text-stone-300 dark:text-slate-600" />
                )}
                <span className="absolute top-3 left-3 rounded-md bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-slate-800 shadow-xs dark:bg-slate-900/90 dark:text-slate-200 border border-stone-200 dark:border-slate-700">
                  {selectedProduct.category}
                </span>
              </div>

              {/* Info */}
              <div className="flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    {selectedProduct.brand}
                  </span>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5">
                    {selectedProduct.name}
                  </h2>

                  {/* Price & Stock */}
                  <div className="mt-3 flex items-baseline gap-3">
                    <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      ₹{Number(selectedProduct.price).toFixed(2)}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-bold ${
                        selectedProduct.stock_quantity > 0
                          ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300'
                          : 'bg-rose-500/10 text-rose-700 dark:text-rose-400'
                      }`}
                    >
                      {selectedProduct.stock_quantity > 0 ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" /> In Stock ({selectedProduct.stock_quantity})
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3.5 w-3.5" /> Out of stock
                        </>
                      )}
                    </span>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    {selectedProduct.description}
                  </p>

                  {selectedProduct.sku && (
                    <p className="mt-2 text-[11px] text-slate-400 font-mono">
                      SKU: {selectedProduct.sku}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-stone-100 dark:border-slate-800">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={(e) => handleSaveProduct(selectedProduct, e)}
                      className={`flex items-center justify-center gap-1.5 rounded-xl border py-2.5 px-3 text-xs font-semibold transition-colors ${
                        savedItems.some((p) => p.id === selectedProduct.id)
                          ? 'border-rose-300 bg-rose-50 text-rose-600 dark:border-rose-900 dark:bg-rose-950/30'
                          : 'border-stone-200 text-slate-700 hover:bg-stone-50 dark:border-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          savedItems.some((p) => p.id === selectedProduct.id) ? 'fill-rose-500 text-rose-500' : ''
                        }`}
                      />
                      {savedItems.some((p) => p.id === selectedProduct.id) ? 'Saved' : 'Save'}
                    </button>
                    <button
                      onClick={(e) => handleAddToCart(selectedProduct, e)}
                      disabled={selectedProduct.stock_quantity <= 0}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 py-2.5 px-3 text-xs font-bold text-slate-950 hover:bg-amber-400 disabled:opacity-50 transition-colors"
                    >
                      <ShoppingCart className="h-4 w-4" /> Add to Cart
                    </button>
                  </div>
                </div>

              </div>

            </div>

            {/* Current Shop Information Card */}
            {(() => {
              const prodShop = shops.find(
                (s) => String(s.id) === String(selectedProduct.shop_id || selectedProduct.shop) || s.name === selectedProduct.shop_name
              );
              if (!prodShop) return null;
              return (
                <div className="mt-6 rounded-xl border border-stone-200 bg-stone-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Available at local store
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">
                        {prodShop.name}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1 mt-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        {prodShop.address} • {prodShop.distance_km} km away
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedProduct(null);
                        setSelectedShop(prodShop);
                      }}
                      className="shrink-0 flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline pt-1"
                    >
                      View Store <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* More from this shop */}
            {(() => {
              const moreItems = products
                .filter(
                  (p) =>
                    p.id !== selectedProduct.id &&
                    (String(p.shop_id) === String(selectedProduct.shop_id) ||
                      String(p.shop) === String(selectedProduct.shop))
                )
                .slice(0, 4);

              if (moreItems.length === 0) return null;

              return (
                <div className="mt-6 pt-4 border-t border-stone-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    More from this store
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {moreItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedProduct(item)}
                        className="rounded-lg border border-stone-200 bg-white p-2 text-left hover:border-stone-300 cursor-pointer dark:border-slate-800 dark:bg-slate-800/50"
                      >
                        <div className="h-16 w-full rounded bg-stone-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                          {item.image_url ? (
                            <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                          ) : (
                            <Package className="h-5 w-5 text-stone-300" />
                          )}
                        </div>
                        <p className="mt-1 font-semibold text-[11px] text-slate-900 dark:text-white truncate">
                          {item.name}
                        </p>
                        <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                          ₹{Number(item.price).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 6: OPTIONAL MAP (OpenStreetMap Drawer with Real Shop Markers) */}
      {/* ========================================================================= */}
      <MapDrawer
        isOpen={mapOpen}
        onClose={() => setMapOpen(false)}
        userLocation={lat && lng ? { lat, lng } : { lat: 12.9716, lng: 77.5946 }}
        shops={nearbyShops}
        radiusKm={radius}
        onSelectShop={(shop) => {
          setSelectedShop(shop);
          setMapOpen(false);
        }}
      />

      {/* CHANGE LOCATION MODAL */}
      {locationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Change Discovery Location</h3>
              </div>
              <button
                onClick={() => setLocationModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* GPS Detection */}
            <div className="mt-4">
              <button
                onClick={handleUseMyLocation}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-2.5 px-4 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors"
              >
                <Crosshair className="h-4 w-4" /> Detect My GPS Location
              </button>
            </div>

            {/* Preset Neighborhoods */}
            <div className="mt-5 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Popular Local Areas
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {PRESET_AREAS.map((area) => (
                  <button
                    key={area}
                    onClick={() => handleSelectArea(area)}
                    className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium border transition-colors ${
                      areaName === area
                        ? 'border-amber-500 bg-amber-500/10 text-amber-900 dark:text-amber-300 font-bold'
                        : 'border-stone-200 hover:border-stone-300 dark:border-slate-800 dark:hover:border-slate-700'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Location Input */}
            <form onSubmit={handleCustomAreaSubmit} className="mt-5 pt-4 border-t border-stone-100 dark:border-slate-800 space-y-2">
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                Or enter custom location name:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customAreaInput}
                  onChange={(e) => setCustomAreaInput(e.target.value)}
                  placeholder="e.g. Indiranagar, Koramangala"
                  className="flex-1 rounded-xl border border-stone-200 px-3 py-2 text-xs outline-none focus:border-amber-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={!customAreaInput.trim()}
                  className="rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50 dark:bg-stone-100 dark:text-slate-950"
                >
                  Set
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
