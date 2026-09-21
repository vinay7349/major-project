import React, { useEffect, useState } from 'react';
import { Store, MapPin, Star, Phone, MessageSquare, Plus, ThumbsUp } from 'lucide-react';
import { communityAPI } from '../../../services/api';
import GlassCard from '../../../components/GlassCard';
import { useToast } from '../../../context/NotificationContext';

const NearbyShopsPage = () => {
  const [shops, setShops] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState('');
  const [authorName, setAuthorName] = useState('Local Retailer');
  const [rating, setRating] = useState(5);
  const { addToast } = useToast();

  useEffect(() => {
    fetchNetworkData();
  }, []);

  const fetchNetworkData = async () => {
    setLoading(true);
    try {
      const [shopRes, revRes] = await Promise.all([
        communityAPI.getNearbyShops(),
        communityAPI.getReviews(),
      ]);
      setShops(shopRes.data.results || shopRes.data || []);
      setReviews(revRes.data.results || revRes.data || []);
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber/10 border border-amber/30 text-cyan-400 text-xs font-semibold mb-2">
          <Store className="w-3.5 h-3.5" /> Neighborhood Merchant Network
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-charcoal dark:text-white">
          Community Retail Network & Nearby Shops
        </h1>
        <p className="text-slate dark:text-slate/80 text-xs mt-1">
          Locate neighboring merchant inventories, check ratings, and share product feedback.
        </p>
      </div>

      {/* Nearby Shop Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {shops.map((shop) => (
          <GlassCard key={shop.id} className="bg-charcoal/60 border-charcoal space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="px-2 py-0.5 rounded-full bg-charcoal/10 border border-charcoal/30 text-indigo-400 text-[10px] font-bold">
                  {shop.category}
                </span>
                <h3 className="font-bold text-white text-base mt-1">{shop.name}</h3>
                <p className="text-xs text-slate/80">Owner: {shop.owner_name}</p>
              </div>
              <span className="flex items-center gap-1 text-amber-400 text-xs font-bold bg-amber/10 px-2 py-1 rounded-lg">
                <Star className="w-3.5 h-3.5 fill-amber-400" /> {shop.rating}
              </span>
            </div>

            <div className="space-y-1 text-xs text-slate/80 border-t border-charcoal pt-3">
              <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-cyan-400" /> {shop.address} ({shop.distance_km} km)</p>
              <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-emerald-400" /> {shop.phone}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Community Reviews & Feedback */}
      <GlassCard className="border-charcoal space-y-6">
        <h3 className="font-bold text-slate/60 text-base flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-400" /> Community Product Reviews & Ratings
        </h3>

        {/* New Review Form */}
        <form onSubmit={handlePostReview} className="space-y-3 bg-charcoal/80 p-4 rounded-2xl border border-charcoal text-xs">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Your Name"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="px-3 py-2 rounded-xl bg-charcoal border border-charcoal text-white"
            />
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="px-3 py-2 rounded-xl bg-charcoal border border-charcoal text-white"
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
            className="w-full px-3 py-2 rounded-xl bg-charcoal border border-charcoal text-white focus:outline-none"
          />
          <button type="submit" className="gradient-btn-primary px-5 py-2 rounded-xl font-bold text-xs">
            Post Community Review
          </button>
        </form>

        {/* Reviews List */}
        <div className="space-y-3 text-xs">
          {reviews.map((r) => (
            <div key={r.id} className="p-4 rounded-2xl bg-charcoal/40 border border-charcoal space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white">{r.author_name}</span>
                <span className="text-amber-400 font-bold">{'★'.repeat(r.rating)}</span>
              </div>
              <p className="text-slate/60">{r.comment}</p>
              <span className="text-[10px] text-slate block">{new Date(r.created_at || Date.now()).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};

export default NearbyShopsPage;



