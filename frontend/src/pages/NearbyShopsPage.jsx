import React, { useEffect, useState } from 'react';
import { Store, MapPin, Star, Phone, MessageSquare, Plus, ChevronDown } from 'lucide-react';
import { communityAPI, productsAPI } from '../services/api';
import GlassCard from '../components/GlassCard';
import ShopCard from '../components/ShopCard';
import ShopDetailDrawer from '../components/ShopDetailDrawer';
import LocationSelector from '../components/LocationSelector';
import MapDrawer from '../components/MapDrawer';
import { LocationProvider, useLocationContext } from '../context/LocationContext';
import { useToast } from '../context/NotificationContext';

const NearbyShopsPage = () => {
  const [shops, setShops] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState('');
  const [authorName, setAuthorName] = useState('Local Retailer');
  const [rating, setRating] = useState(5);
  const { addToast } = useToast();
  const { radius, setRadius, lat, lng } = useLocationContext();
  const [selectedShop, setSelectedShop] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [showMap, setShowMap] = useState(false);

  // Listen for map marker clicks to open shop drawer
  useEffect(() => {
    const handler = (e) => {
      const shopId = e.detail;
      const shop = shops.find((s) => s.id === shopId);
      if (shop) setSelectedShop(shop);
    };
    window.addEventListener('openShop', handler);
    return () => window.removeEventListener('openShop', handler);
  }, [shops]);

  useEffect(() => {
    fetchNetworkData();
  }, []);

  const fetchNetworkData = async () => {
    setLoading(true);
    try {
      const [shopRes, revRes, productRes] = await Promise.all([
        communityAPI.getNearbyShops(),
        communityAPI.getReviews(),
        productsAPI.getAll(),
      ]);
      setShops(shopRes.data.results || shopRes.data || []);
      setReviews(revRes.data.results || revRes.data || []);
      setAllProducts(productRes.data.results || productRes.data || []);
    } catch (err) {
      console.error(err);
      setShops([
        { id: 1, name: 'Metro Gourmet Corner', owner_name: 'Robert Chen', category: 'Deli & Organic', distance_km: 0.6, rating: 4.9, phone: '+1 555-9011', address: 'Market Street, Sector 4' },
        { id: 2, name: 'Green Valley Organics', owner_name: 'Maria Santos', category: 'Fresh Produce', distance_km: 1.4, rating: 4.7, phone: '+1 555-9022', address: '7th Avenue Plaza' },
        { id: 3, name: 'Apex QuickMart 24/7', owner_name: 'Vikram Patel', category: 'Convenience Store', distance_km: 2.1, rating: 4.6, phone: '+1 555-9033', address: 'Downtown Hub' },
      ]);
      setReviews([
        { id: 1, author_name: 'David R.', rating: 5, comment: 'Super fresh almond milk supply! Best store partner in the area.', created_at: new Date().toISOString() },
        { id: 2, author_name: 'Elena M.', rating: 5, comment: 'Quick delivery and accurate stock listings.', created_at: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePostReview = async (e) => {
    e.preventDefault();
    if (!newReview.trim()) return;

    try {
      await communityAPI.createReview({
        product: 1,
        author_name: authorName,
        rating: parseInt(rating),
        comment: newReview,
      });
      addToast('Review submitted to retail community network!', 'success');
      setNewReview('');
      fetchNetworkData();
    } catch (err) {
      addToast('Review added locally', 'success');
      setReviews(prev => [
        { id: Date.now(), author_name: authorName, rating: parseInt(rating), comment: newReview, created_at: new Date().toISOString() },
        ...prev
      ]);
      setNewReview('');
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-2">
          <Store className="w-3.5 h-3.5" /> Neighborhood Merchant Network
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">
          Community Retail Network & Nearby Shops
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
          Locate neighboring merchant inventories, check ratings, and share product feedback.
        </p>
      </div>
      <LocationSelector />
      <button onClick={() => setShowMap(true)} className="ml-2 px-3 py-1 bg-amber-500 text-white rounded-lg hover:bg-amber-600">Show Map</button>
      {/* Nearby Shop Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {shops.map((shop) => (
          <ShopCard
            key={shop.id}
            shop={shop}
            onSelect={setSelectedShop}
            onFollow={(shopId) => {
              addToast('Follow action requires login', 'info');
            }}
          />
        ))}
      </div>

      {/* Community Reviews & Feedback */}
      <GlassCard className="border-slate-800 space-y-6">
        <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-400" /> Community Product Reviews & Ratings
        </h3>

        {/* New Review Form */}
        <form onSubmit={handlePostReview} className="space-y-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Your Name"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
            />
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
            >
              <option value="5">5 Stars ★★★★★</option>
              <option value="4">4 Stars ★★★★☆</option>
              <option value="3">3 Stars ★★★☆☆</option>
            </select>
          </div>
          <textarea
            placeholder="Share feedback on product quality, supplier speed, or store experience..."
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
          />
          <button type="submit" className="gradient-btn-primary px-5 py-2 rounded-xl font-bold text-xs">
            Post Community Review
          </button>
        </form>

        {/* Reviews List */}
        <div className="space-y-3 text-xs">
          {reviews.map((r) => (
            <div key={r.id} className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white">{r.author_name}</span>
                <span className="text-amber-400 font-bold">{'★'.repeat(r.rating)}</span>
              </div>
              <p className="text-slate-300">{r.comment}</p>
              <span className="text-[10px] text-slate-500 block">{new Date(r.created_at || Date.now()).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
        {selectedShop && (
          <ShopDetailDrawer
            shop={selectedShop}
            products={allProducts.filter((p) => p.shop === selectedShop.id || p.shop_name === selectedShop.name)}
            onClose={() => setSelectedShop(null)}
          />
        )}
  );
};

export default NearbyShopsPage;
