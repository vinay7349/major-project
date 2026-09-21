import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/NotificationContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Navigation, Star, Heart, ArrowRight, Store, Clock } from 'lucide-react';

/**
 * Production-ready Compact ShopCard for ShopGenie Customer Discovery
 * Required fields:
 * - Shop name
 * - Distance
 * - Open/Closed
 * - Address
 * - Product count
 * - View Shop
 * - Directions
 * - Follow
 */
const ShopCard = ({ shop, onSelect, onFollow, isFollowed = false }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [followed, setFollowed] = useState(isFollowed);

  if (!shop) return null;

  const handleFollow = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.info('Please sign in to follow your favourite shops');
      navigate('/customer/login', { state: { from: location.pathname + location.search } });
      return;
    }
    const nextState = !followed;
    setFollowed(nextState);
    toast.success(nextState ? `Following ${shop.name}` : `Unfollowed ${shop.name}`);
    if (onFollow) onFollow(shop.id, nextState);
  };

  const handleDirections = (e) => {
    e.stopPropagation();
    const destination = shop.lat && shop.lng
      ? `${shop.lat},${shop.lng}`
      : encodeURIComponent(shop.address ? `${shop.name}, ${shop.address}` : shop.name);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}`, '_blank', 'noopener,noreferrer');
  };

  const isOpen = shop.is_open !== false;
  const productCount = shop.product_count ?? shop.products?.length;

  return (
    <div
      onClick={() => onSelect && onSelect(shop)}
      className="group relative flex flex-col justify-between rounded-2xl border border-warmwhite/60 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-warmwhite/60 hover:shadow-md dark:border-charcoal dark:bg-charcoal/90 dark:hover:border-charcoal cursor-pointer"
    >
      <div>
        {/* Header row: category / status / rating */}
        <div className="flex items-center justify-between gap-2 pb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="rounded-md bg-amber/10 px-2 py-0.5 text-[11px] font-semibold text-amber dark:text-amber-300 border border-amber/20">
              {shop.category || 'Local Retail'}
            </span>
            <span
              className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium ${
                isOpen
                  ? 'bg-mutedgreen/10 text-mutedgreen dark:text-emerald-300'
                  : 'bg-warmwhite text-slate dark:bg-charcoal dark:text-slate/80'
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${isOpen ? 'bg-mutedgreen dark:bg-emerald-400' : 'bg-slate'}`} />
              {isOpen ? 'Open Now' : 'Closed'}
            </span>
          </div>

          {/* Rating - only show when provided */}
          {shop.rating != null && (
            <span className="flex items-center gap-1 text-xs font-bold text-amber dark:text-amber-400">
              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber" />
              {Number(shop.rating).toFixed(1)}
            </span>
          )}
        </div>

        {/* Shop Name & Distance */}
        <div className="mt-1 flex items-baseline justify-between gap-2">
          <h3 className="text-base font-bold tracking-tight text-navy group-hover:text-amber dark:text-white dark:group-hover:text-amber-400 transition-colors">
            {shop.name}
          </h3>
          {shop.distance_km != null && (
            <span className="shrink-0 text-xs font-semibold text-charcoal dark:text-slate/60">
              {Number(shop.distance_km).toFixed(1)} km
            </span>
          )}
        </div>

        {/* Address */}
        <p className="mt-1.5 flex items-start gap-1.5 text-xs text-slate dark:text-slate/80 line-clamp-2">
          <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5 text-slate/80" />
          <span>{shop.address || 'Local neighborhood store'}</span>
        </p>
      </div>

      {/* Footer Info & Actions */}
      <div className="mt-4 pt-3 border-t border-warmwhite/60 dark:border-charcoal/80">
        <div className="flex items-center justify-between pb-3 text-xs text-slate dark:text-slate/80">
          <span className="flex items-center gap-1">
            <Store className="h-3.5 w-3.5 text-slate/80" />
            {productCount != null ? `${productCount} products listed` : 'Catalog available'}
          </span>
          <button
            onClick={handleFollow}
            className={`flex items-center gap-1 text-xs font-semibold transition-colors ${
              followed
                ? 'text-red dark:text-rose-400'
                : 'text-slate hover:text-charcoal dark:text-slate/80 dark:hover:text-white'
            }`}
            title={followed ? 'Unfollow shop' : 'Follow shop'}
          >
            <Heart className={`h-3.5 w-3.5 ${followed ? 'fill-rose-500 text-red' : ''}`} />
            {followed ? 'Following' : 'Follow'}
          </button>
        </div>

        {/* Button Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect && onSelect(shop);
            }}
            className="flex items-center justify-center gap-1 rounded-xl bg-charcoal py-2 px-3 text-xs font-semibold text-white transition-colors hover:bg-charcoal dark:bg-amber dark:text-slate-950 dark:hover:bg-amber-400"
          >
            View Shop <ArrowRight className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={handleDirections}
            className="flex items-center justify-center gap-1 rounded-xl border border-warmwhite/60 py-2 px-3 text-xs font-semibold text-charcoal transition-colors hover:bg-warmwhite hover:border-warmwhite/60 dark:border-charcoal dark:text-slate/60 dark:hover:bg-charcoal"
          >
            <Navigation className="h-3.5 w-3.5 text-slate" /> Directions
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopCard;


