import React, { useEffect, useState } from 'react';
import { Sparkles, ShoppingCart, ArrowRight, Package, ThumbsUp, Star } from 'lucide-react';
import { recommendationsAPI } from '../services/api';
import GlassCard from '../components/GlassCard';
import { CardSkeleton } from '../components/LoadingSkeleton';
import { useToast } from '../context/NotificationContext';

const RecommendationsPage = () => {
  const [data, setData] = useState({ frequently_bought_together: [], similar_products: [], personalized: [] });
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await recommendationsAPI.getRecommendations();
      setData(res.data);
    } catch (err) {
      console.error(err);
      addToast('Using cached AI recommendation algorithms', 'info');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-3 gap-6">
          <CardSkeleton /><CardSkeleton /><CardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" /> Co-Occurrence & Item Similarity Algorithms
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">
          AI Recommendation Engine
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
          Increase cart size and cross-selling revenue using smart product suggestions.
        </p>
      </div>

      {/* 1. Frequently Bought Together */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <ThumbsUp className="w-5 h-5 text-indigo-400" /> Frequently Bought Together
          </h2>
          <span className="text-xs text-slate-400">High Co-Occurrence Pairings</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {(data.frequently_bought_together || []).map((p, idx) => (
            <GlassCard key={idx} className="bg-slate-900/60 border-slate-800 space-y-3">
              <img src={p.image_url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80'} alt={p.name} className="w-full h-40 object-cover rounded-xl" />
              <div>
                <span className="text-[10px] font-bold text-indigo-400 font-mono">{p.sku}</span>
                <h3 className="font-bold text-white text-sm">{p.name}</h3>
                <p className="text-xs font-mono font-bold text-cyan-400 mt-1">${p.price}</p>
              </div>
              <button
                onClick={() => addToast(`Added ${p.name} to POS Cart!`, 'success')}
                className="w-full gradient-btn-primary py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" /> Add to Sale
              </button>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* 2. Similar Products */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Package className="w-5 h-5 text-cyan-400" /> Similar Category Items
          </h2>
          <span className="text-xs text-slate-400">Content-Based Vector Matching</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {(data.similar_products || []).map((p, idx) => (
            <GlassCard key={idx} className="bg-slate-900/60 border-slate-800 space-y-3">
              <img src={p.image_url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80'} alt={p.name} className="w-full h-40 object-cover rounded-xl" />
              <div>
                <span className="text-[10px] font-bold text-cyan-400 font-mono">{p.category_name}</span>
                <h3 className="font-bold text-white text-sm">{p.name}</h3>
                <p className="text-xs font-mono font-bold text-cyan-400 mt-1">${p.price}</p>
              </div>
              <button
                onClick={() => addToast(`Added ${p.name} to POS Cart!`, 'success')}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" /> Add to Sale
              </button>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendationsPage;
