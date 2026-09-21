import React, { createContext, useContext, useState, useEffect } from 'react';

// Context to hold user's location and radius
const LocationContext = createContext({
  lat: null,
  lng: null,
  radius: 5, // km default
  areaName: '',
  setLocation: () => {},
  setRadius: () => {},
});

export const LocationProvider = ({ children }) => {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [radius, setRadius] = useState(() => {
    const storedRadius = Number(localStorage.getItem('shopgenie_discovery_radius'));
    return Number.isFinite(storedRadius) && storedRadius > 0 ? storedRadius : 5;
  });
  const [areaName, setAreaName] = useState(() => localStorage.getItem('shopgenie_discovery_area') || '');

  useEffect(() => {
    if (!areaName && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLng(position.coords.longitude);
          setAreaName('Current Location');
        },
        (err) => {
          console.warn('Geolocation error', err);
        }
      );
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('shopgenie_discovery_area', areaName);
    localStorage.setItem('shopgenie_discovery_radius', String(radius));
  }, [areaName, radius]);

  const setLocation = (newLat, newLng, name = '') => {
    setLat(newLat);
    setLng(newLng);
    if (name) setAreaName(name);
  };

  return (
    <LocationContext.Provider value={{ lat, lng, radius, areaName, setLocation, setRadius }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => useContext(LocationContext);
