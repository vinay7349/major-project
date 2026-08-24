import React, { useEffect, useState } from 'react';
import { X, Store, CheckCircle, AlertTriangle, Star, Tag, Barcode, ShieldAlert, MessageSquare } from 'lucide-react';
import { communityAPI } from '../services/api';

const ProductDetailModal = ({ product, shop, onClose }) => {
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    if (!product) return;
    const fetchReviews = async () => {
      setLoadingReviews(true);
      try {
        const response = await communityAPI.getReviews({ product_id: product.id });
        setReviews(response.data.results || response.data || []);
      } catch (err) {
        console.error('Failed to load reviews:', err);
      } finally {
        setLoadingReviews(false);
      }
    };
    fetchReviews();
  }, [product]);

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const response = await communityAPI.createReview({
        product: product.id,
        rating: newRating,
        comment: newComment,
        author_name: authorName.trim() || 'Verified Customer'
      });
      setReviews([response.data, ...reviews]);
      setNewComment('');
      setReviewSubmitted(true);
      setTimeout(() => setReviewSubmitted(false), 3000);
    } catch (err) {
      console.error('Failed to submit review:', err);
    }
  };

  if (!product) return null;

  const isAvailable = (product.stock_quantity ?? 10) > 0;
  const shopName = shop?.name || product.shop_name || 'Genie Partner Store';
  const displayPrice = typeof product.price === 'number' || !isNaN(Number(product.price)) 
    ? `₹${Number(product.price).toFixed(2)}` 
    : product.price;

  const imageUrl = product.image_url || product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-fade-scale">
      <div className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-900/95 p-6 sm:p-8 shadow-2xl text-white my-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Content */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Product Image */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/50 aspect-square flex items-center justify-center">
            <img
              src={imageUrl}
              alt={product.name}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';
              }}
            />
            <span className="absolute top-3 left-3 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-semibold text-cyan-300 backdrop-blur-md border border-cyan-500/20">
              {product.category_name || product.category || 'General'}
            </span>
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <Store className="h-3.5 w-3.5 text-cyan-400" />
                <span>{shopName}</span>
              </div>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">{product.name}</h2>
              
              <div className="mt-3 flex items-center gap-3">
                <span className="text-3xl font-extrabold text-cyan-300">{displayPrice}</span>
                {isAvailable ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>In Stock ({product.stock_quantity || 'Available'})</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-400 border border-rose-500/20">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>Out of Stock</span>
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2 border-t border-white/10 pt-4 text-xs text-slate-300">
              <p className="leading-relaxed text-slate-300">
                {product.description || 'Premium product available for local discovery and in-store pick-up.'}
              </p>
              
              {product.sku && (
                <div className="flex items-center gap-2 pt-2 text-slate-400 font-mono">
                  <Tag className="h-3.5 w-3.5 text-cyan-400" />
                  <span>SKU: {product.sku}</span>
                </div>
              )}
              
              {product.barcode && (
                <div className="flex items-center gap-2 text-slate-400 font-mono">
                  <Barcode className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Barcode: {product.barcode}</span>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3 text-xs text-cyan-200 flex items-start gap-2">
              <ShieldAlert className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>Visit <strong>{shopName}</strong> to purchase or inspect this item in person.</span>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-8 border-t border-white/10 pt-6">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-bold text-white">
              <MessageSquare className="h-5 w-5 text-cyan-400" />
              <span>Customer Reviews</span>
            </h3>
            <span className="text-xs text-slate-400">{reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</span>
          </div>

          {/* Reviews List */}
          <div className="mt-4 space-y-3 max-h-48 overflow-y-auto pr-1">
            {loadingReviews ? (
              <p className="text-xs text-slate-400 animate-pulse">Loading reviews...</p>
            ) : reviews.length > 0 ? (
              reviews.map((rev, idx) => (
                <div key={rev.id || idx} className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{rev.author_name || 'Verified Customer'}</span>
                    <div className="flex items-center text-amber-400">
                      {'★'.repeat(rev.rating || 5)}
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-slate-300 leading-normal">{rev.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400">No reviews yet for this product. Be the first to leave a review!</p>
            )}
          </div>

          {/* Add Review Form */}
          <form onSubmit={handleAddReview} className="mt-5 space-y-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <h4 className="text-xs font-semibold text-slate-200">Write a Review</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Your Name (e.g., Sarah J.)"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="h-10 rounded-xl border border-white/10 bg-slate-950/60 px-3 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500/50"
              />
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span>Rating:</span>
                <select
                  value={newRating}
                  onChange={(e) => setNewRating(Number(e.target.value))}
                  className="h-10 rounded-xl border border-white/10 bg-slate-950/60 px-3 text-xs text-amber-400 outline-none focus:border-cyan-500/50"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                  <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                  <option value={3}>⭐⭐⭐ (3/5)</option>
                  <option value={2}>⭐⭐ (2/5)</option>
                  <option value={1}>⭐ (1/5)</option>
                </select>
              </div>
            </div>
            <textarea
              rows={2}
              placeholder="Share your experience with this product..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 p-3 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500/50"
            />
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:from-cyan-400 hover:to-indigo-500 transition-all shadow-md"
              >
                Submit Review
              </button>
              {reviewSubmitted && <span className="text-xs text-emerald-400 font-medium">✓ Review posted!</span>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
