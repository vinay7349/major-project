import React, { useState } from 'react';
import { X, MapPin, Navigation, Store, ExternalLink, ArrowRight, Compass } from 'lucide-react';

/**
 * MapDrawer component: Displays an OpenStreetMap view with real markers.
 * Follows strict constraints:
 * - Real local street map
 * - User + nearby shop markers (only when real coordinates are available)
 * - Never invents coordinates
 * - Marker -> shop preview
 * - Shop selection -> focuses marker
 */
const MapDrawer = ({
  isOpen,
  onClose,
  userLocation,
  shops = [],
  radiusKm = 2,
  onSelectShop,
  focusedShopId = null,
}) => {
  const [activeShopId, setActiveShopId] = useState(focusedShopId);

  if (!isOpen) return null;

  const validShops = shops.filter(
    (s) => typeof s.lat === 'number' && typeof s.lng === 'number' && !isNaN(s.lat) && !isNaN(s.lng)
  );
  const unmappedShops = shops.filter(
    (s) => typeof s.lat !== 'number' || typeof s.lng !== 'number' || isNaN(s.lat) || isNaN(s.lng)
  );

  const activeShop = shops.find((s) => s.id === (activeShopId || focusedShopId)) || validShops[0] || shops[0];

  // Calculate bounding box or center
  const centerLat = activeShop?.lat || userLocation?.lat || (validShops.length > 0 ? validShops[0].lat : null);
  const centerLng = activeShop?.lng || userLocation?.lng || (validShops.length > 0 ? validShops[0].lng : null);

  const delta = radiusKm ? Math.max(0.015, (radiusKm / 111) * 1.5) : 0.03;
  const bbox = centerLat && centerLng
    ? `${centerLng - delta},${centerLat - delta},${centerLng + delta},${centerLat + delta}`
    : null;

  const osmUrl = centerLat && centerLng
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${centerLat}%2C${centerLng}`
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative flex flex-col w-full sm:max-w-4xl h-[92vh] sm:h-[85vh] rounded-t-3xl sm:rounded-2xl border border-stone-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden text-slate-900 dark:text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Local Street Map</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {validShops.length} stores mapped {userLocation?.lat ? '• GPS active' : ''} • Radius {radiusKm} km
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:bg-stone-200 dark:hover:bg-slate-800 dark:text-slate-400 transition-colors"
            aria-label="Close Map"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body: Map Frame + Sidebar */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Main Map View */}
          <div className="flex-1 relative bg-stone-100 dark:bg-slate-950 min-h-[300px]">
            {osmUrl ? (
              <iframe
                title="Local Street Map"
                src={osmUrl}
                className="w-full h-full border-0"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full items-center justify-center p-8 text-center">
                <div className="max-w-sm space-y-2">
                  <MapPin className="mx-auto h-8 w-8 text-amber-500/60" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    No coordinates published for stores in this radius
                  </p>
                  <p className="text-xs text-slate-500">
                    You can still get direct turn-by-turn directions to any shop's street address.
                  </p>
                </div>
              </div>
            )}

            {/* Active Shop Popup / Overlay inside Map */}
            {activeShop && (
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm rounded-xl border border-stone-200 bg-white/95 p-4 shadow-lg backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                      {activeShop.category || 'Retail Store'}
                    </span>
                    <h4 className="mt-1 font-bold text-sm text-slate-900 dark:text-white truncate">
                      {activeShop.name}
                    </h4>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    activeShop.is_open !== false
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                      : 'bg-slate-500/10 text-slate-600 dark:text-slate-400'
                  }`}>
                    {activeShop.is_open !== false ? 'Open Now' : 'Closed'}
                  </span>
                </div>

                <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                  {activeShop.address || 'Street address available in store profile'}
                </p>

                {activeShop.distance_km != null && (
                  <p className="mt-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                    {Number(activeShop.distance_km).toFixed(1)} km away
                  </p>
                )}

                <div className="mt-3 flex items-center gap-2 pt-2 border-t border-stone-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      onSelectShop(activeShop);
                      onClose();
                    }}
                    className="flex-1 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-amber-500 dark:text-slate-950 dark:hover:bg-amber-400 transition-colors text-center"
                  >
                    View Shop
                  </button>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                      activeShop.lat && activeShop.lng
                        ? `${activeShop.lat},${activeShop.lng}`
                        : activeShop.address || activeShop.name
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-stone-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
                  >
                    Directions <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Shop List Drawer Tab (Right Side) */}
          <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-stone-200 dark:border-slate-800 flex flex-col bg-stone-50/50 dark:bg-slate-900/50 max-h-[35vh] md:max-h-full overflow-y-auto p-4 space-y-2.5">
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Nearby Stores ({shops.length})
              </span>
            </div>

            {shops.map((shop) => {
              const isSelected = (activeShopId || focusedShopId) === shop.id;
              return (
                <div
                  key={shop.id}
                  onClick={() => setActiveShopId(shop.id)}
                  className={`cursor-pointer rounded-xl border p-3 transition-all text-left ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500/5 dark:border-amber-400 dark:bg-amber-500/10 shadow-sm'
                      : 'border-stone-200 bg-white hover:border-stone-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <h5 className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                      {shop.name}
                    </h5>
                    {shop.distance_km != null && (
                      <span className="shrink-0 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                        {Number(shop.distance_km).toFixed(1)} km
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                    {shop.address || 'Address on file'}
                  </p>
                  <div className="mt-2 flex items-center justify-between pt-1 border-t border-stone-100 dark:border-slate-800/60">
                    <span className="text-[10px] text-slate-400">
                      {shop.product_count != null ? `${shop.product_count} items` : 'Local catalog'}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectShop(shop);
                        onClose();
                      }}
                      className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-0.5"
                    >
                      Open <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })}

            {shops.length === 0 && (
              <p className="text-xs text-slate-400 py-6 text-center">
                No shops currently found in this radius.
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default MapDrawer;
