import React from 'react';
import { MapPin, ChevronsUpDown } from 'lucide-react';
import { useLocationContext } from '../context/LocationContext';

// Simple inline location selector used in header and mobile UI
const LocationSelector = () => {
  const { lat, lng, radius, areaName, setLocation, setRadius } = useLocationContext();

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation(pos.coords.latitude, pos.coords.longitude, 'Current Location');
        },
        (err) => console.warn('Geolocation error', err)
      );
    }
  };

  return (
    <div className="flex cursor-pointer items-center gap-2 rounded-xl border border-warmwhite/60 bg-white/80 px-3 py-2 text-sm text-charcoal hover:border-warmwhite/60 hover:bg-white transition-colors dark:border-charcoal dark:bg-charcoal/80 dark:text-slate/60">
      <MapPin className="h-4 w-4 text-amber dark:text-amber-400 shrink-0" />
      <span className="font-medium whitespace-nowrap">{areaName || 'Location'}</span>
      <span className="text-[11px] text-slate dark:text-slate/80">{radius} km</span>
      <ChevronsUpDown className="h-3.5 w-3.5 text-slate/80" />
      {/* For simplicity, clicking triggers geolocation */}
      <button
        onClick={handleUseMyLocation}
        className="ml-2 text-xs text-amber underline"
        title="Use My Location"
      >
        Use My Location
      </button>
    </div>
  );
};

export default LocationSelector;


