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
  const [radius, setRadius] = useState(5);
  const [areaName, setAreaName] = useState('');

  // Try to get geolocation on mount
  useEffect(() => {
    if (navigator.geolocation) {
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
