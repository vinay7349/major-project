import React, { useEffect, useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Search, 
  Package, 
  Store, 
  MapPin, 
  Star, 
  SlidersHorizontal, 
  X, 
  CheckCircle, 
  AlertTriangle, 
  ArrowRight, 
  ArrowLeftRight, 
  Eye, 
  Sparkles, 
  ShoppingBag,
  RefreshCw
} from 'lucide-react';
import { productsAPI, communityAPI } from '../services/api';
import CustomerDiscoveryHeader from '../components/CustomerDiscoveryHeader';
import ProductDetailModal from '../components/ProductDetailModal';
import ShopDetailModal from '../components/ShopDetailModal';
import ProductCompareModal from '../components/ProductCompareModal';
import FilterDrawer from '../components/FilterDrawer';

// Seeded fallback data for seamless demo when backend is offline
const FALLBACK_CATEGORIES = [
  { id: 1, name: 'Beverages & Drinks' },
  { id: 2, name: 'Snacks & Confectionery' },
  { id: 3, name: 'Dairy & Breakfast' },
  { id: 4, name: 'Fresh Produce' },
  { id: 5, name: 'Personal Care' },
  { id: 6, name: 'Household Supplies' },
];

const FALLBACK_PRODUCTS = [
  {
    id: 101,
    name: 'Organic Almond Milk 1L',
    sku: 'BEV-ALM-001',
    category_name: 'Dairy & Breakfast',
    price: 4.99,
    stock_quantity: 42,
    shop_name: 'Metro Gourmet Corner',
    rating: 4.9,
    description: '100% organic unsweetened almond milk enriched with Vitamin D and Calcium.',
    image_url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 102,
    name: 'Artisan Cold Brew Coffee 330ml',
    sku: 'BEV-COF-002',
    category_name: 'Beverages & Drinks',
    price: 3.75,
    stock_quantity: 4,
    shop_name: 'Genie Mart Downtown',
    rating: 4.8,
    description: 'Slow-steeped cold brew coffee crafted from 100% Arabica dark roast beans.',
    image_url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 103,
    name: 'Dark Chocolate Sea Salt Bar 100g',
    sku: 'SNK-CHO-003',
    category_name: 'Snacks & Confectionery',
    price: 2.99,
    stock_quantity: 65,
    shop_name: 'Apex QuickMart 24/7',
    rating: 4.7,
    description: 'Single-origin 72% dark chocolate infused with hand-harvested sea salt flakes.',
    image_url: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 104,
    name: 'Avocado Hass Fresh (Pack of 3)',
    sku: 'PRD-AVO-004',
    category_name: 'Fresh Produce',
    price: 5.49,
    stock_quantity: 2,
    shop_name: 'Green Valley Organics',
    rating: 4.9,
    description: 'Farm-fresh creamy Hass avocados rich in healthy omega fats.',
    image_url: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 105,
    name: 'Greek Honey Yogurt 500g',
    sku: 'DRY-YOG-005',
    category_name: 'Dairy & Breakfast',
    price: 3.89,
    stock_quantity: 28,
    shop_name: 'Metro Gourmet Corner',
    rating: 4.6,
    description: 'Traditional thick strained Greek yogurt blended with wildflower honey.',
    image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 106,
    name: 'Botanical Body Wash Lavender 500ml',
    sku: 'CAR-WAS-006',
    category_name: 'Personal Care',
    price: 8.99,
    stock_quantity: 18,
    shop_name: 'Apex QuickMart 24/7',
    rating: 4.8,
    description: 'Soothing organic lavender body cleanser with natural essential oils.',
    image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 107,
    name: 'Eco Multi-Surface Spray 750ml',
    sku: 'HSH-SPR-007',
    category_name: 'Household Supplies',
    price: 6.49,
    stock_quantity: 12,
    shop_name: 'Green Valley Organics',
    rating: 4.5,
    description: 'Plant-based non-toxic cleaner suitable for granite, glass, and wood.',
    image_url: 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 108,
    name: 'Gluten-Free Granola Oats 400g',
    sku: 'DRY-GRA-008',
    category_name: 'Dairy & Breakfast',
    price: 6.29,
    stock_quantity: 50,
    shop_name: 'Genie Mart Downtown',
    rating: 4.7,
    description: 'Crispy toasted whole grain oats baked with almonds, pecans and maple syrup.',
    image_url: 'https://images.unsplash.com/photo-1517093157656-b9ecedd173ac?auto=format&fit=crop&w=600&q=80'
  }
];

const FALLBACK_SHOPS = [
  {
    id: 1,
    name: 'Metro Gourmet Corner',
    owner_name: 'Robert Chen',
    category: 'Deli & Organic',
    distance_km: 0.6,
    rating: 4.9,
    address: '142 Grand Avenue, Downtown',
    phone: '+1 (555) 901-2345',
    is_open: true,
    available_products_count: 142
  },
  {
    id: 2,
    name: 'Green Valley Organics',
    owner_name: 'Maria Santos',
    category: 'Fresh Produce',
    distance_km: 1.4,
    rating: 4.7,
    address: '88 Market Street, Sector 4',
    phone: '+1 (555) 902-6789',
    is_open: true,
    available_products_count: 98
  },
  {
    id: 3,
    name: 'Apex QuickMart 24/7',
    owner_name: 'Vikram Patel',
    category: 'Convenience Store',
    distance_km: 2.1,
    rating: 4.6,
    address: '502 Central Boulevard',
    phone: '+1 (555) 903-4455',
    is_open: true,
    available_products_count: 210
  }
];

const CustomerHomePage = () => {
  const [products, setProducts] = useState([]);
  const [shops, setShops] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [maxPrice, setMaxPrice] = useState(50);
  const [selectedShop, setSelectedShop] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Modals & Comparison State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedShopModal, setSelectedShopModal] = useState(null);
  const [compareList, setCompareList] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Load Data from REST API (with Fallback fallback if offline)
  useEffect(() => {
    let isMounted = true;
    const loadDiscoveryData = async () => {
      setLoading(true);
      try {
        const [productsResponse, shopsResponse, categoriesResponse] = await Promise.all([
          productsAPI.getAll({ search }).catch(() => ({ data: [] })),
          communityAPI.getNearbyShops().catch(() => ({ data: [] })),
          productsAPI.getCategories().catch(() => ({ data: [] })),
        ]);

        if (!isMounted) return;

        const fetchedProducts = productsResponse.data?.results || productsResponse.data || [];
        const fetchedShops = shopsResponse.data?.results || shopsResponse.data || [];
        const fetchedCats = categoriesResponse.data?.results || categoriesResponse.data || [];

        setProducts(fetchedProducts.length > 0 ? fetchedProducts : FALLBACK_PRODUCTS);
        setShops(fetchedShops.length > 0 ? fetchedShops : FALLBACK_SHOPS);
        setCategories(fetchedCats.length > 0 ? fetchedCats : FALLBACK_CATEGORIES);
      } catch (error) {
        console.error('Could not load customer discovery data:', error);
        if (isMounted) {
          setProducts(FALLBACK_PRODUCTS);
          setShops(FALLBACK_SHOPS);
          setCategories(FALLBACK_CATEGORIES);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadDiscoveryData();

    return () => {
      isMounted = false;
    };
  }, [search]);

  // Client-side Filter Matrix (product name, category, shop name, price, stock)
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const pName = (p.name || '').toLowerCase();
      const pCat = (p.category_name || p.category || '').toLowerCase();
      const pShop = (p.shop_name || '').toLowerCase();
      const query = search.toLowerCase().trim();

      // Search matching (product name, category, shop name)
      const matchesSearch = !query || pName.includes(query) || pCat.includes(query) || pShop.includes(query);

      // Category matching
      const matchesCategory = selectedCategory === 'all' || 
        (p.category_name || p.category || '').toLowerCase() === selectedCategory.toLowerCase();

      // Stock filter
      const matchesStock = !onlyInStock || (p.stock_quantity ?? 10) > 0;

      // Price filter
      const matchesPrice = Number(p.price || 0) <= maxPrice;

      // Shop filter
      const matchesShop = selectedShop === 'all' || (p.shop_name || '').toLowerCase() === selectedShop.toLowerCase();

      return matchesSearch && matchesCategory && matchesStock && matchesPrice && matchesShop;
    });
  }, [products, search, selectedCategory, onlyInStock, maxPrice, selectedShop]);

  // Toggle product in comparison list
  const toggleCompare = (product) => {
    if (compareList.some((item) => item.id === product.id)) {
      setCompareList(compareList.filter((item) => item.id !== product.id));
    } else {
      if (compareList.length >= 3) {
        alert('You can compare up to 3 products at a time.');
        return;
      }
      setCompareList([...compareList, product]);
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setOnlyInStock(false);
    setMaxPrice(50);
    setSelectedShop('all');
    setIsFilterOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-cyan-500 selection:text-slate-950 pb-24">
      {/* Top Customer Header */}
      <CustomerDiscoveryHeader />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        {/* Hero Section */}
        <section className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-indigo-950/40 p-6 sm:p-10 backdrop-blur-xl shadow-2xl overflow-hidden">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Customer discovery</span>
              </div>
              <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Find products and shops near you
              </h1>
              <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
                Search products, compare prices and availability, and explore nearby shops and their reviews.
              </p>
            </div>

            {/* Customer Profile Shortcut */}
            <div className="shrink-0">
              <NavLink
                to="/customer/profile"
                className="group inline-flex items-center gap-2 rounded-2xl border border-cyan-400/30 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 px-5 py-3.5 text-sm font-semibold text-cyan-200 hover:border-cyan-400 hover:text-white hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
              >
                <span>Manage customer profile</span>
                <ArrowRight className="h-4 w-4 text-cyan-300 group-hover:translate-x-1 transition-transform" />
              </NavLink>
            </div>
          </div>

          {/* Prominent Search Bar */}
          <div className="relative mt-8">
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products, shops or categories..."
                className="h-14 w-full rounded-2xl border border-white/15 bg-slate-950/70 py-3 pl-12 pr-28 text-sm sm:text-base text-white placeholder-slate-400 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 transition-all shadow-inner"
              />
              <div className="absolute right-3 flex items-center gap-2">
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                    title="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                    selectedCategory !== 'all' || onlyInStock || selectedShop !== 'all' || maxPrice < 50
                      ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300'
                      : 'border-white/10 bg-white/[0.08] text-slate-300 hover:bg-white/15'
                  }`}
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Filter</span>
                </button>
              </div>
            </div>
          </div>

          {/* Scrollable Category Filter Pills */}
          <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`shrink-0 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/25'
                  : 'border border-white/10 bg-white/[0.05] text-slate-300 hover:bg-white/10'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id || cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`shrink-0 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                  selectedCategory === cat.name
                    ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/25'
                    : 'border border-white/10 bg-white/[0.05] text-slate-300 hover:bg-white/10'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </section>

        {/* PRODUCTS SECTION */}
        <section className="mt-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">Products to explore</h2>
                <p className="text-xs text-slate-400">Discover items, compare pricing & real-time stock</p>
              </div>
            </div>

            {/* Active Filters Bar / Count */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-400">
                Showing <strong className="text-cyan-300">{filteredProducts.length}</strong> items
              </span>
              {(selectedCategory !== 'all' || search || onlyInStock || selectedShop !== 'all') && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 text-xs text-cyan-400 hover:text-white transition-colors"
                >
                  <RefreshCw className="h-3 w-3" /> Reset
                </button>
              )}
            </div>
          </div>

          {/* Product Grid */}
          <div className="mt-6">
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 animate-pulse space-y-4">
                    <div className="h-44 bg-slate-800/80 rounded-2xl w-full"></div>
                    <div className="h-4 bg-slate-800/80 rounded-lg w-1/3"></div>
                    <div className="h-6 bg-slate-800/80 rounded-lg w-3/4"></div>
                    <div className="h-8 bg-slate-800/80 rounded-xl w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filteredProducts.map((product) => {
                  const isAvailable = (product.stock_quantity ?? 10) > 0;
                  const isCompared = compareList.some((item) => item.id === product.id);
                  const imageUrl = product.image_url || product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';

                  return (
                    <article
                      key={product.id}
                      className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:bg-slate-900/90 hover:shadow-xl hover:shadow-cyan-500/10"
                    >
                      <div>
                        {/* Image Container */}
                        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950 aspect-[4/3] flex items-center justify-center">
                          <img
                            src={imageUrl}
                            alt={product.name}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';
                            }}
                          />
                          {/* Category Badge */}
                          <span className="absolute top-2.5 left-2.5 rounded-full bg-slate-950/80 px-2.5 py-0.5 text-[10px] font-semibold text-cyan-300 backdrop-blur-md border border-cyan-500/20">
                            {product.category_name || product.category || 'General'}
                          </span>

                          {/* Compare Checkbox Button */}
                          <button
                            onClick={() => toggleCompare(product)}
                            className={`absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold backdrop-blur-md border transition-all ${
                              isCompared
                                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md'
                                : 'bg-slate-950/70 text-slate-300 border-white/20 hover:bg-slate-950 hover:text-white'
                            }`}
                            title="Compare side-by-side"
                          >
                            <ArrowLeftRight className="h-3 w-3" />
                            <span>{isCompared ? 'Compared' : '+ Compare'}</span>
                          </button>
                        </div>

                        {/* Product Title & Shop */}
                        <div className="mt-4">
                          <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                            <Store className="h-3 w-3 text-indigo-400" />
                            <span className="truncate">{product.shop_name || 'Genie Partner Shop'}</span>
                          </div>
                          <h3 className="mt-1 text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                            {product.name}
                          </h3>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                        {/* Price & Availability */}
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xl font-extrabold text-cyan-300">
                              ₹{Number(product.price || 0).toFixed(2)}
                            </span>
                          </div>

                          {isAvailable ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
                              <CheckCircle className="h-3 w-3" />
                              <span>✓ Available</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-0.5 text-[11px] font-semibold text-rose-400 border border-rose-500/20">
                              <AlertTriangle className="h-3 w-3" />
                              <span>Out of stock</span>
                            </span>
                          )}
                        </div>

                        {/* View Details Action */}
                        <button
                          onClick={() => setSelectedProduct(product)}
                          className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] py-2.5 text-xs font-semibold text-white hover:border-cyan-400/50 hover:bg-cyan-500/20 hover:text-cyan-200 transition-all"
                        >
                          <Eye className="h-3.5 w-3.5 text-cyan-400" />
                          <span>View Details</span>
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              /* REQUIRED EXACT EMPTY STATE FOR NO PRODUCTS */
              <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-12 text-center backdrop-blur-md">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-white">No products match your search yet.</h3>
                <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
                  Try another search or explore categories to find available local products.
                </p>
                <div className="mt-6 flex items-center justify-center gap-3">
                  <button
                    onClick={handleResetFilters}
                    className="rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-indigo-500 transition-all"
                  >
                    Explore All Categories
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* NEARBY SHOPS SECTION */}
        <section className="mt-16">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white">Nearby shops</h2>
              <p className="text-xs text-slate-400">Discover registered local retailers around your area</p>
            </div>
          </div>

          <div className="mt-6">
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 animate-pulse space-y-4">
                    <div className="h-6 bg-slate-800/80 rounded-lg w-1/2"></div>
                    <div className="h-4 bg-slate-800/80 rounded-lg w-3/4"></div>
                    <div className="h-10 bg-slate-800/80 rounded-xl w-full"></div>
                  </div>
                ))}
              </div>
            ) : shops.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {shops.map((shop) => (
                  <article
                    key={shop.id}
                    className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:bg-slate-900/90 hover:shadow-xl hover:shadow-indigo-500/10"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-lg shadow-md group-hover:scale-105 transition-transform">
                            🏪
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                              {shop.name}
                            </h3>
                            <span className="text-[11px] font-medium text-slate-400">
                              {shop.category || 'General Store'}
                            </span>
                          </div>
                        </div>

                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/10 px-2.5 py-1 text-xs font-bold text-amber-300 border border-amber-400/20">
                          <Star className="h-3 w-3 fill-amber-400" />
                          <span>{shop.rating || '4.6'}</span>
                        </span>
                      </div>

                      <div className="mt-4 space-y-2 text-xs text-slate-300 border-t border-white/10 pt-4">
                        <p className="flex items-center gap-2 text-slate-300">
                          <MapPin className="h-4 w-4 text-cyan-400 shrink-0" />
                          <span className="truncate">{shop.address || 'Market Street, Sector 4'}</span>
                        </p>
                        {shop.distance_km && (
                          <p className="flex items-center gap-2 text-slate-400">
                            <span className="text-indigo-400 font-bold">📍</span>
                            <span>{shop.distance_km} km away</span>
                          </p>
                        )}
                        <p className="text-slate-400">
                          Products available: <strong className="text-white">{shop.available_products_count || 125}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-white/10">
                      <button
                        onClick={() => setSelectedShopModal(shop)}
                        className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] py-2.5 text-xs font-semibold text-white hover:border-indigo-400/50 hover:bg-indigo-500/20 hover:text-indigo-200 transition-all"
                      >
                        <Store className="h-3.5 w-3.5 text-indigo-400" />
                        <span>View Shop</span>
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              /* REQUIRED EXACT EMPTY STATE FOR NO SHOPS */
              <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-12 text-center backdrop-blur-md">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <MapPin className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-white">Nearby shop details will appear here when available.</h3>
                <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
                  We are expanding retailer coverage in your local area. Check back soon for updated shop listings.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* STICKY BOTTOM COMPARISON BAR */}
      {compareList.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-3xl rounded-2xl border border-cyan-500/40 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-2xl animate-fade-up">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300 font-bold text-xs border border-cyan-500/30">
                {compareList.length}
              </div>
              <div>
                <p className="text-xs font-bold text-white">Comparing Products ({compareList.length}/3)</p>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  {compareList.map((p) => p.name).join(', ')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCompareList([])}
                className="rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-xs text-slate-400 hover:text-white transition-colors"
              >
                Clear
              </button>
              <button
                onClick={() => setIsCompareModalOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-indigo-500 transition-all"
              >
                <ArrowLeftRight className="h-4 w-4" />
                <span>Compare Specs</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FILTER DRAWER MODAL */}
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        categories={categories}
        shops={shops}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onlyInStock={onlyInStock}
        setOnlyInStock={setOnlyInStock}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        selectedShop={selectedShop}
        setSelectedShop={setSelectedShop}
        onReset={handleResetFilters}
      />

      {/* PRODUCT DETAIL MODAL */}
      <ProductDetailModal
        product={selectedProduct}
        shop={shops.find((s) => s.name === selectedProduct?.shop_name)}
        onClose={() => setSelectedProduct(null)}
      />

      {/* SHOP DETAIL MODAL */}
      <ShopDetailModal
        shop={selectedShopModal}
        products={products}
        onClose={() => setSelectedShopModal(null)}
      />

      {/* PRODUCT COMPARE MODAL */}
      {isCompareModalOpen && (
        <ProductCompareModal
          compareProducts={compareList}
          onRemove={(id) => setCompareList(compareList.filter((p) => p.id !== id))}
          onClear={() => {
            setCompareList([]);
            setIsCompareModalOpen(false);
          }}
          onClose={() => setIsCompareModalOpen(false)}
        />
      )}
    </div>
  );
};

export default CustomerHomePage;
