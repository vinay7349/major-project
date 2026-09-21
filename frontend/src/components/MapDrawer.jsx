import React, { useEffect, useState } from 'react';
import { ArrowRight, Compass, MapPin, Store, X } from 'lucide-react';

const hasCoordinates = (value) =>
  typeof value?.lat === 'number' &&
  typeof value?.lng === 'number' &&
  Number.isFinite(value.lat) &&
  Number.isFinite(value.lng);

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

  useEffect(() => {
    if (focusedShopId != null) {
      setActiveShopId(focusedShopId);
    }
  }, [focusedShopId]);

  if (!isOpen) return null;

  const validShops = shops.filter((shop) => hasCoordinates(shop));
  const unmappedShops = shops.filter((shop) => !hasCoordinates(shop));
  const mappedPoints = [
    ...validShops,
    ...(hasCoordinates(userLocation) ? [userLocation] : []),
  ];

  const bounds = mappedPoints.reduce(
    (result, point) => ({
      minLat: Math.min(result.minLat, point.lat),
      maxLat: Math.max(result.maxLat, point.lat),
      minLng: Math.min(result.minLng, point.lng),
      maxLng: Math.max(result.maxLng, point.lng),
    }),
    {
      minLat: Infinity,
      maxLat: -Infinity,
      minLng: Infinity,
      maxLng: -Infinity,
    }
  );

  const hasMapData = mappedPoints.length > 0 && Number.isFinite(bounds.minLat);
  const latRange = hasMapData ? Math.max(bounds.maxLat - bounds.minLat, 0.002) : 0;
  const lngRange = hasMapData ? Math.max(bounds.maxLng - bounds.minLng, 0.002) : 0;

  const activeShop =
    shops.find((shop) => shop.id === (activeShopId ?? focusedShopId)) ||
    validShops[0] ||
    shops[0];

  const center = hasCoordinates(activeShop)
    ? activeShop
    : hasCoordinates(userLocation)
      ? userLocation
      : validShops[0] || null;

  const toMapPosition = (point) => {
    if (!hasMapData || !hasCoordinates(point)) return null;
    return {
      left: ((point.lng - bounds.minLng) / lngRange) * 100,
      top: ((bounds.maxLat - point.lat) / latRange) * 100,
    };
  };

  const centerPosition = toMapPosition(center);
  const radiusLatDegrees = radiusKm ? radiusKm / 111 : 0;
  const radiusLngDegrees =
    radiusKm && center ? radiusKm / (111 * Math.cos((center.lat * Math.PI) / 180)) : 0;
  const radiusX = hasMapData ? (radiusLngDegrees / lngRange) * 100 : 0;
  const radiusY = hasMapData ? (radiusLatDegrees / latRange) * 100 : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-navy/70 p-0 backdrop-blur-sm animate-fade-in sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Nearby shops map"
    >
      <div className="flex h-[92vh] w-full flex-col overflow-hidden border border-warmwhite/60 bg-white text-navy shadow-2xl dark:border-charcoal dark:bg-charcoal dark:text-slate/60 sm:h-[85vh] sm:rounded-2xl sm:max-w-4xl">
        <div className="flex items-center justify-between border-b border-warmwhite/60 bg-warmwhite px-5 py-4 dark:border-charcoal dark:bg-charcoal/90">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber/20 bg-amber/10 text-amber dark:text-amber-400">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-navy dark:text-white">Local Shop Map</h2>
              <p className="text-xs text-slate dark:text-slate/80">
                {validShops.length} stores mapped
                {hasCoordinates(userLocation) ? ' • GPS active' : ''} • Radius {radiusKm} km
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate transition-colors hover:bg-warmwhite dark:hover:bg-charcoal dark:text-slate/80"
            aria-label="Close Map"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
          <div className="relative min-h-[300px] flex-1 overflow-hidden bg-warmwhite dark:bg-navy">
            {hasMapData && centerPosition ? (
              <>
                <svg
                  className="absolute inset-0 h-full w-full"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <rect width="100" height="100" fill="currentColor" className="text-stone-50 dark:text-navy" />
                  <g stroke="rgba(100,116,139,0.16)" strokeWidth="0.25" vectorEffect="non-scaling-stroke">
                    {[12.5, 25, 37.5, 50, 62.5, 75, 87.5].map((position) => (
                      <React.Fragment key={`h-${position}`}>
                        <line x1="0" x2="100" y1={position} y2={position} />
                        <line x1={position} x2={position} y1="0" y2="100" />
                      </React.Fragment>
                    ))}
                  </g>
                  <g stroke="rgba(245,158,11,0.22)" strokeWidth="1.4" vectorEffect="non-scaling-stroke" fill="none">
                    <path d="M0 22 C 22 18, 35 30, 55 25 S 86 15, 100 20" />
                    <path d="M0 58 C 18 62, 42 50, 64 58 S 88 72, 100 65" />
                    <path d="M18 0 C 24 28, 12 55, 24 100" />
                    <path d="M54 0 C 48 32, 62 62, 52 100" />
                    <path d="M82 0 C 78 36, 90 68, 80 100" />
                  </g>
                  <g stroke="rgba(15,23,42,0.08)" strokeWidth="0.55" vectorEffect="non-scaling-stroke" fill="none">
                    <path d="M0 39 H100" />
                    <path d="M0 78 H100" />
                    <path d="M37 0 V100" />
                    <path d="M70 0 V100" />
                  </g>
                  {radiusX > 0 && radiusY > 0 && (
                    <ellipse
                      cx={centerPosition.left}
                      cy={centerPosition.top}
                      rx={radiusX}
                      ry={radiusY}
                      fill="rgba(245,158,11,0.08)"
                      stroke="rgba(245,158,11,0.55)"
                      strokeWidth="0.45"
                      strokeDasharray="2 1.5"
                      vectorEffect="non-scaling-stroke"
                    />
                  )}
                </svg>

                <div className="absolute left-3 top-3 rounded-lg border border-warmwhite/60 bg-white/90 px-2.5 py-1.5 text-[10px] font-semibold text-slate shadow-sm backdrop-blur dark:border-charcoal dark:bg-charcoal/90 dark:text-slate/60">
                  Internal map • {radiusKm} km search area
                </div>

                {validShops.map((shop) => {
                  const position = toMapPosition(shop);
                  if (!position) return null;
                  const isActive = shop.id === (activeShopId ?? focusedShopId);
                  return (
                    <button
                      key={shop.id}
                      type="button"
                      onClick={() => setActiveShopId(shop.id)}
                      style={{ left: `${position.left}%`, top: `${position.top}%` }}
                      className={`absolute z-10 -translate-x-1/2 -translate-y-full rounded-full p-1.5 shadow-lg transition-transform hover:scale-110 ${
                        isActive
                          ? 'bg-amber text-slate-950 ring-4 ring-amber/20'
                          : 'bg-white text-amber ring-2 ring-white dark:bg-charcoal dark:text-amber-400 dark:ring-slate-900'
                      }`}
                      aria-label={`Show ${shop.name} on map`}
                    >
                      <Store className="h-4 w-4" />
                    </button>
                  );
                })}

                {hasCoordinates(userLocation) && (
                  <div
                    style={{
                      left: `${toMapPosition(userLocation).left}%`,
                      top: `${toMapPosition(userLocation).top}%`,
                    }}
                    className="absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-mutedgreen p-1.5 text-white ring-4 ring-mutedgreen/20 shadow-lg"
                    aria-label="Your location"
                  >
                    <MapPin className="h-4 w-4" />
                  </div>
                )}

                {activeShop && (
                  <div className="absolute bottom-4 left-4 right-4 max-w-sm rounded-xl border border-warmwhite/60 bg-white/95 p-4 shadow-lg backdrop-blur-md dark:border-charcoal dark:bg-charcoal/95 sm:right-auto">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="inline-block rounded-full border border-amber/20 bg-amber/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber dark:text-amber-400">
                          {activeShop.category || 'Retail Store'}
                        </span>
                        <h4 className="mt-1 truncate text-sm font-bold text-navy dark:text-white">
                          {activeShop.name}
                        </h4>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          activeShop.is_open !== false
                            ? 'bg-mutedgreen/10 text-mutedgreen dark:text-emerald-400'
                            : 'bg-slate/10 text-slate dark:text-slate/80'
                        }`}
                      >
                        {activeShop.is_open !== false ? 'Open Now' : 'Closed'}
                      </span>
                    </div>

                    <p className="mt-1.5 line-clamp-2 text-xs text-slate dark:text-slate/80">
                      {activeShop.address || 'Street address available in store profile'}
                    </p>

                    {activeShop.distance_km != null && (
                      <p className="mt-1 text-xs font-semibold text-amber dark:text-amber-400">
                        {Number(activeShop.distance_km).toFixed(1)} km away
                      </p>
                    )}

                    <div className="mt-3 flex items-center gap-2 border-t border-warmwhite/60 pt-3 dark:border-charcoal">
                      <button
                        onClick={() => {
                          onSelectShop(activeShop);
                          onClose();
                        }}
                        className="flex-1 rounded-lg bg-charcoal px-3 py-1.5 text-center text-xs font-semibold text-white transition-colors hover:bg-charcoal dark:bg-amber dark:text-slate-950 dark:hover:bg-amber-400"
                      >
                        View Shop
                      </button>
                      <button
                        onClick={() => setActiveShopId(activeShop.id)}
                        className="flex items-center gap-1 rounded-lg border border-warmwhite/60 px-3 py-1.5 text-xs font-semibold text-charcoal transition-colors hover:bg-warmwhite dark:border-charcoal dark:text-slate/60 dark:hover:bg-charcoal"
                      >
                        Center Map <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex h-full items-center justify-center p-8 text-center">
                <div className="max-w-sm space-y-2">
                  <MapPin className="mx-auto h-8 w-8 text-amber/60" />
                  <p className="text-sm font-semibold text-charcoal dark:text-slate/60">
                    No coordinates published for stores in this radius
                  </p>
                  <p className="text-xs text-slate">
                    Shop addresses remain available in the store list and shop profiles.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="max-h-[35vh] w-full space-y-2.5 overflow-y-auto border-t border-warmwhite/60 bg-warmwhite/50 p-4 dark:border-charcoal dark:bg-charcoal/50 md:max-h-full md:w-80 md:border-t-0 md:border-l">
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal dark:text-slate/60">
                Nearby Stores ({shops.length})
              </span>
              {unmappedShops.length > 0 && (
                <span className="text-[10px] text-slate/80">{unmappedShops.length} without coordinates</span>
              )}
            </div>

            {shops.map((shop) => {
              const isSelected = shop.id === (activeShopId ?? focusedShopId);
              return (
                <div
                  key={shop.id}
                  onClick={() => setActiveShopId(shop.id)}
                  className={`cursor-pointer rounded-xl border p-3 transition-all text-left ${
                    isSelected
                      ? 'border-amber bg-amber/5 shadow-sm dark:border-amber-400 dark:bg-amber/10'
                      : 'border-warmwhite/60 bg-white hover:border-warmwhite/60 dark:border-charcoal dark:bg-charcoal dark:hover:border-charcoal'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <h5 className="truncate text-xs font-semibold text-navy dark:text-white">
                      {shop.name}
                    </h5>
                    {shop.distance_km != null && (
                      <span className="shrink-0 text-[11px] font-bold text-amber dark:text-amber-400">
                        {Number(shop.distance_km).toFixed(1)} km
                      </span>
                    )}
                  </div>
                  <p className="mt-1 line-clamp-1 text-[11px] text-slate dark:text-slate/80">
                    {shop.address || 'Address on file'}
                  </p>
                  <div className="mt-2 flex items-center justify-between border-t border-warmwhite/60 pt-2 dark:border-charcoal/60">
                    <span className="text-[10px] text-slate/80">
                      {shop.product_count != null ? `${shop.product_count} items` : 'Local catalog'}
                    </span>
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        setActiveShopId(shop.id);
                      }}
                      className="flex items-center gap-0.5 text-[11px] font-semibold text-amber hover:underline dark:text-amber-400"
                    >
                      Locate <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })}

            {shops.length === 0 && (
              <p className="py-6 text-center text-xs text-slate/80">
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

