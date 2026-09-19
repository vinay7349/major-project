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
    <div className="flex cursor-pointer items-center gap-2 rounded-xl border border-stone-200 bg-white/80 px-3 py-2 text-sm text-slate-700 hover:border-stone-300 hover:bg-white transition-colors dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200">
      <MapPin className="h-4 w-4 text-amber-500 dark:text-amber-400 shrink-0" />
      <span className="font-medium whitespace-nowrap">{areaName || 'Location'}</span>
      <span className="text-[11px] text-slate-500 dark:text-slate-400">{radius} km</span>
      <ChevronsUpDown className="h-3.5 w-3.5 text-slate-400" />
      {/* For simplicity, clicking triggers geolocation */}
      <button
        onClick={handleUseMyLocation}
        className="ml-2 text-xs text-amber-600 underline"
        title="Use My Location"
      >
        Use My Location
      </button>
    </div>
  );
};

export default LocationSelector;
