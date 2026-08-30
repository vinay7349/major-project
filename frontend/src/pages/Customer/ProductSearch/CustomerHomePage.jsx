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
  RefreshCw,
  ArrowUpDown,
  Tag,
  Filter
} from 'lucide-react';
import { productsAPI, communityAPI } from '../../../services/api';
import ProductDetailModal from '../../../components/ProductDetailModal';
import ShopDetailModal from '../../../components/ShopDetailModal';
import ProductCompareModal from '../../../components/ProductCompareModal';
import FilterDrawer from '../../../components/FilterDrawer';

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
    distance_km: 0.6,
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
    distance_km: 1.1,
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
    distance_km: 2.1,
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
    distance_km: 1.4,
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
    distance_km: 0.6,
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
    distance_km: 2.1,
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
    distance_km: 1.4,
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
    distance_km: 1.1,
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
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('relevance');
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

  // Client-side Filter Matrix & Sorting
  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => {
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

      // Rating filter
      const matchesRating = minRating === 0 || (p.rating || 4.7) >= minRating;

      return matchesSearch && matchesCategory && matchesStock && matchesPrice && matchesShop && matchesRating;
    });

    // Sorting logic
    if (sortBy === 'price-low') {
      list.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    } else if (sortBy === 'rating') {
      list.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    } else if (sortBy === 'stock') {
      list.sort((a, b) => (b.stock_quantity || 0) - (a.stock_quantity || 0));
    }

    return list;
  }, [products, search, selectedCategory, onlyInStock, maxPrice, selectedShop, minRating, sortBy]);

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
    setMinRating(0);
    setSortBy('relevance');
    setIsFilterOpen(false);
  };

  const activeFilterChips = [
    search ? { label: `Search: ${search}`, onRemove: () => setSearch('') } : null,
    selectedCategory !== 'all' ? { label: selectedCategory, onRemove: () => setSelectedCategory('all') } : null,
    onlyInStock ? { label: 'In stock', onRemove: () => setOnlyInStock(false) } : null,
    maxPrice < 50 ? { label: `Under ₹${maxPrice}`, onRemove: () => setMaxPrice(50) } : null,
    selectedShop !== 'all' ? { label: selectedShop, onRemove: () => setSelectedShop('all') } : null,
    minRating > 0 ? { label: `${minRating}+ stars`, onRemove: () => setMinRating(0) } : null,
  ].filter(Boolean);

  return (
    <div className="bg-[#f6f1ea] pb-24 text-slate-900 transition-colors duration-300 dark:bg-[#0d1320] dark:text-slate-100">
      <main className="mx-auto max-w-7xl px-4 pb-8 pt-6 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[28px] border border-stone-200/80 bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.16),transparent_30%),linear-gradient(135deg,#fffdf9_0%,#f7f2eb_42%,#f3efe9_100%)] p-5 shadow-[0_12px_28px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.12),transparent_30%),linear-gradient(135deg,#0f172a_0%,#111827_46%,#0d1320_100%)] sm:p-7 lg:p-8">
          <div className="absolute -right-12 -top-8 h-40 w-40 rounded-full bg-amber-500/15 blur-3xl dark:bg-amber-500/10" />
          <div className="absolute bottom-4 left-10 h-32 w-32 rounded-full bg-orange-500/10 blur-3xl dark:bg-orange-400/10" />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">
                <Sparkles className="h-3.5 w-3.5" />
                Local discovery
              </div>
              <h1 className="mt-4 text-3xl font-extrabold tracking-[-0.05em] text-slate-900 dark:text-white sm:text-4xl">
                Shop local. Find it nearby.
              </h1>
              <p className="mt-2 max-w-lg text-sm text-slate-600 dark:text-slate-300 sm:text-base">
                Search products, compare nearby stores, and discover what’s freshest in your area.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start rounded-2xl border border-stone-200 bg-white/75 p-3 shadow-sm shadow-stone-200/40 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/75 dark:shadow-none">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/12 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Current area</p>
                <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">Downtown Sector 4</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Within 2.5 km</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-6">
            <div className="relative flex items-center">
              <Search className="pointer-events-none absolute left-4 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products, brands, or categories..."
                className="h-14 w-full rounded-2xl border border-stone-200 bg-white/80 pl-12 pr-24 text-sm text-slate-800 shadow-sm shadow-stone-200/40 outline-none transition-all placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:shadow-none dark:placeholder:text-slate-500"
              />
              <div className="absolute right-3 flex items-center gap-2">
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-stone-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(true)}
                  className="hidden items-center gap-1.5 rounded-xl border border-stone-200 bg-[#fffaf2] px-3 py-2 text-[11px] font-semibold text-slate-700 transition-colors hover:bg-stone-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 lg:flex"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                  Filters
                </button>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-5 flex items-center gap-2 overflow-x-auto pb-1.5 no-scrollbar">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`shrink-0 rounded-2xl px-4 py-2.5 text-xs font-semibold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900'
                  : 'border border-stone-200 bg-white/70 text-slate-600 hover:border-stone-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id || cat.name}
                type="button"
                onClick={() => setSelectedCategory(cat.name)}
                className={`shrink-0 rounded-2xl px-4 py-2.5 text-xs font-semibold transition-all ${
                  selectedCategory === cat.name
                    ? 'bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900'
                    : 'border border-stone-200 bg-white/70 text-slate-600 hover:border-stone-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-8 flex flex-col gap-6 lg:grid lg:grid-cols-12">
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="rounded-[24px] border border-stone-200 bg-white/80 p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Filters</h3>
                </div>
                {(selectedCategory !== 'all' || onlyInStock || selectedShop !== 'all' || maxPrice < 50 || minRating > 0 || search) && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 transition-colors hover:text-amber-600 dark:text-amber-300"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Reset
                  </button>
                )}
              </div>

              <div className="mt-5 space-y-5">
                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Categories</label>
                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedCategory('all')}
                      className={`flex w-full items-center justify-between rounded-2xl px-3 py-2 text-xs font-medium transition-colors ${
                        selectedCategory === 'all'
                          ? 'bg-amber-500/10 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20'
                          : 'text-slate-600 hover:bg-stone-100 dark:text-slate-300 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>All categories</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">{products.length}</span>
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id || cat.name}
                        type="button"
                        onClick={() => setSelectedCategory(cat.name)}
                        className={`flex w-full items-center rounded-2xl px-3 py-2 text-left text-xs font-medium transition-colors ${
                          selectedCategory === cat.name
                            ? 'bg-amber-500/10 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20'
                            : 'text-slate-600 hover:bg-stone-100 dark:text-slate-300 dark:hover:bg-slate-800'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Max price</label>
                    <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">₹{maxPrice}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    step="1"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-stone-200 accent-amber-500 dark:bg-slate-700"
                  />
                  <div className="mt-2 flex justify-between text-[10px] text-slate-400 dark:text-slate-500">
                    <span>₹1</span>
                    <span>₹25</span>
                    <span>₹50+</span>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-stone-200 bg-stone-50 p-3 dark:border-slate-700 dark:bg-slate-800/80">
                  <div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">In stock only</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Hide sold-out items</p>
                  </div>
                  <button
                    type="button"
                    aria-label="Toggle in-stock filter"
                    onClick={() => setOnlyInStock(!onlyInStock)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      onlyInStock ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        onlyInStock ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Min rating</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[0, 4.0, 4.5, 4.8].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setMinRating(rating)}
                        className={`rounded-xl border px-2 py-2 text-[11px] font-semibold transition-colors ${
                          minRating === rating
                            ? 'border-amber-400 bg-amber-500/10 text-amber-700 dark:text-amber-300'
                            : 'border-stone-200 bg-white text-slate-500 hover:bg-stone-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                        }`}
                      >
                        {rating === 0 ? 'All' : `${rating}★`}
                      </button>
                    ))}
                  </div>
                </div>

                {shops.length > 0 && (
                  <div>
                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Nearby shop</label>
                    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                      <div className="space-y-1.5 p-2">
                        <button
                          type="button"
                          onClick={() => setSelectedShop('all')}
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-colors ${
                            selectedShop === 'all'
                              ? 'bg-amber-500/10 text-amber-700 ring-1 ring-amber-500/20 dark:text-amber-300'
                              : 'text-slate-600 hover:bg-stone-100 dark:text-slate-300 dark:hover:bg-slate-800'
                          }`}
                        >
                          <span>All nearby shops</span>
                        </button>
                        {shops.map((s) => (
                          <button
                            key={s.id || s.name}
                            type="button"
                            onClick={() => setSelectedShop(s.name)}
                            className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-colors ${
                              selectedShop === s.name
                                ? 'bg-amber-500/10 text-amber-700 ring-1 ring-amber-500/20 dark:text-amber-300'
                                : 'text-slate-600 hover:bg-stone-100 dark:text-slate-300 dark:hover:bg-slate-800'
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
          </aside>

          <div className="lg:col-span-9">
            <div className="mb-5 flex flex-col gap-3 border-b border-stone-200 pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-[-0.04em] text-slate-900 dark:text-white">Products near you</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{filteredProducts.length} products</p>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:justify-end">
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(true)}
                  className="flex items-center gap-1.5 rounded-2xl border border-stone-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-600 lg:hidden dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                  Filters
                </button>

                <div className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-white px-2.5 py-2 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent pr-1 text-xs font-medium text-slate-700 outline-none dark:text-slate-200"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price-low">Price: low to high</option>
                    <option value="price-high">Price: high to low</option>
                    <option value="rating">Highest rated</option>
                    <option value="stock">In stock first</option>
                  </select>
                </div>
              </div>
            </div>

            {activeFilterChips.length > 0 && (
              <div className="mb-5 flex flex-wrap items-center gap-2">
                {activeFilterChips.map((chip) => (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={chip.onRemove}
                    className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-slate-700 transition-colors hover:border-stone-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  >
                    <span>{chip.label}</span>
                    <X className="h-3 w-3" />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-2">
              {loading ? (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="animate-pulse rounded-[26px] border border-stone-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                      <div className="h-44 w-full rounded-[18px] bg-stone-200 dark:bg-slate-800" />
                      <div className="mt-3 h-3 w-1/3 rounded-full bg-stone-200 dark:bg-slate-800" />
                      <div className="mt-2 h-5 w-2/3 rounded-full bg-stone-200 dark:bg-slate-800" />
                      <div className="mt-3 h-7 w-1/3 rounded-full bg-stone-200 dark:bg-slate-800" />
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredProducts.map((product) => {
                    const isAvailable = (product.stock_quantity ?? 10) > 0;
                    const isCompared = compareList.some((item) => item.id === product.id);
                    const imageUrl = product.image_url || product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';

                    return (
                      <article
                        key={product.id}
                        className="group flex flex-col justify-between rounded-[26px] border border-stone-200 bg-white p-3.5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-1 hover:border-amber-300 hover:shadow-[0_16px_30px_rgba(245,158,11,0.08)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none"
                      >
                        <div>
                          <div className="relative overflow-hidden rounded-[20px] bg-stone-100 dark:bg-slate-800">
                            <img
                              src={imageUrl}
                              alt={product.name}
                              className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';
                              }}
                            />

                            <span className="absolute left-2.5 top-2.5 rounded-full border border-white/30 bg-white/80 px-2 py-1 text-[10px] font-semibold text-slate-700 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200">
                              {product.category_name || product.category || 'General'}
                            </span>

                            <button
                              type="button"
                              onClick={() => toggleCompare(product)}
                              className={`absolute right-2.5 top-2.5 flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold backdrop-blur-sm transition-colors ${
                                isCompared
                                  ? 'bg-amber-500 text-white'
                                  : 'bg-slate-900/75 text-white hover:bg-slate-900'
                              }`}
                              title="Compare product"
                            >
                              <ArrowLeftRight className="h-3 w-3" />
                              {isCompared ? 'Added' : 'Compare'}
                            </button>
                          </div>

                          <div className="mt-3">
                            <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                              <span className="flex items-center gap-1.5 truncate">
                                <Store className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                                <span className="truncate">{product.shop_name || 'Genie Partner Shop'}</span>
                              </span>
                              <span className="flex items-center gap-1 text-amber-500 dark:text-amber-300">
                                <Star className="h-3.5 w-3.5 fill-current" />
                                {product.rating || '4.8'}
                              </span>
                            </div>

                            <h3 className="mt-2 text-base font-semibold tracking-[-0.03em] text-slate-900 dark:text-white">
                              {product.name}
                            </h3>
                          </div>
                        </div>

                        <div className="mt-4 border-t border-stone-200 pt-3 dark:border-slate-700">
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <span className="text-[11px] text-slate-500 dark:text-slate-400">Price</span>
                              <div className="mt-0.5 text-2xl font-extrabold tracking-[-0.05em] text-slate-900 dark:text-white">
                                ₹{Number(product.price || 0).toFixed(2)}
                              </div>
                            </div>

                            {isAvailable ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                                <CheckCircle className="h-3 w-3" />
                                In stock
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-1 text-[10px] font-semibold text-rose-700 dark:text-rose-300">
                                <AlertTriangle className="h-3 w-3" />
                                Sold out
                              </span>
                            )}
                          </div>

                          <div className="mt-3 flex items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5 text-slate-400" />
                              {product.distance_km || 0.6} km away
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => setSelectedProduct(product)}
                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-slate-700 dark:bg-amber-500 dark:text-slate-950 dark:hover:bg-amber-400"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View product
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-[26px] border border-stone-200 bg-white p-12 text-center shadow-[0_8px_24px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-300">
                    <ShoppingBag className="h-8 w-8" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">No products match your search yet.</h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Try a new search, reset filters, or browse all nearby categories.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="mt-5 rounded-2xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-slate-700 dark:bg-amber-500 dark:text-slate-950 dark:hover:bg-amber-400"
                  >
                    Explore all categories
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="mt-16 border-t border-stone-200 pt-10 dark:border-slate-800">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold tracking-[-0.05em] text-slate-900 dark:text-white">Shops near you</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Find local stores and check what’s available before you visit.</p>
            </div>
          </div>

          <div className="mt-6">
            {loading ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse rounded-[26px] border border-stone-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                    <div className="h-12 w-12 rounded-2xl bg-stone-200 dark:bg-slate-800" />
                    <div className="mt-4 h-5 w-2/3 rounded-full bg-stone-200 dark:bg-slate-800" />
                    <div className="mt-2 h-4 w-1/2 rounded-full bg-stone-200 dark:bg-slate-800" />
                  </div>
                ))}
              </div>
            ) : shops.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {shops.map((shop) => (
                  <article
                    key={shop.id}
                    className="rounded-[26px] border border-stone-200 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-1 hover:border-stone-300 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-lg text-white shadow-sm">
                          🏪
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-slate-900 dark:text-white">{shop.name}</h3>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">{shop.category || 'General Store'}</p>
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-1 text-[10px] font-semibold text-amber-700 dark:text-amber-300">
                        <Star className="h-3 w-3 fill-current" />
                        {shop.rating || '4.8'}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2 border-t border-stone-200 pt-4 text-xs text-slate-600 dark:border-slate-700 dark:text-slate-300">
                      <p className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                        <span>{shop.address || 'Market Street, Sector 4'}</span>
                      </p>
                      <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                        <span>{shop.distance_km || 1.2} km away</span>
                        <span>{shop.available_products_count || 125} products</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedShopModal(shop)}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:border-stone-300 hover:bg-stone-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                    >
                      <Store className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                      View store
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-[26px] border border-stone-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-300">
                  <MapPin className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">No nearby shops available yet.</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">We are expanding our local inventory coverage in your area.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {compareList.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-3xl rounded-[24px] border border-amber-300/50 bg-white/95 p-4 shadow-[0_12px_32px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-amber-500/30 dark:bg-slate-900/95">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-sm font-bold text-white">
                {compareList.length}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Compare products ({compareList.length}/3)</p>
                <p className="hidden text-[11px] text-slate-500 dark:text-slate-400 sm:block">{compareList.map((p) => p.name).join(', ')}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCompareList([])}
                className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-stone-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setIsCompareModalOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-slate-700 dark:bg-amber-500 dark:text-slate-950 dark:hover:bg-amber-400"
              >
                <ArrowLeftRight className="h-4 w-4" />
                Compare specs
              </button>
            </div>
          </div>
        </div>
      )}

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
        minRating={minRating}
        setMinRating={setMinRating}
        onReset={handleResetFilters}
      />

      <ProductDetailModal
        product={selectedProduct}
        shop={shops.find((s) => s.name === selectedProduct?.shop_name)}
        shops={shops}
        onClose={() => setSelectedProduct(null)}
        onViewShop={(shopToView) => setSelectedShopModal(shopToView)}
      />

      <ShopDetailModal
        shop={selectedShopModal}
        products={products}
        onClose={() => setSelectedShopModal(null)}
      />

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
