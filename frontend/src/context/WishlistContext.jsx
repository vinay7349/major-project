import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext({
  savedItems: [],
  savedShops: [],
  toggleSave: () => {},
  toggleSaveShop: () => {},
});

export const WishlistProvider = ({ children }) => {
  const [savedItems, setSavedItems] = useState(() => {
    try {
      const stored = localStorage.getItem('wishlistItems');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [savedShops, setSavedShops] = useState(() => {
    try {
      const stored = localStorage.getItem('savedShops');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('wishlistItems', JSON.stringify(savedItems));
  }, [savedItems]);

  useEffect(() => {
    localStorage.setItem('savedShops', JSON.stringify(savedShops));
  }, [savedShops]);

  const toggleSave = (product) => {
    setSavedItems((prev) => {
      const exists = prev.find((item) => String(item.id) === String(product.id));
      if (exists) {
        return prev.filter((item) => String(item.id) !== String(product.id));
      }
      return [...prev, product];
    });
  };

  const toggleSaveShop = (shop) => {
    setSavedShops((prev) => {
      const exists = prev.find((item) => String(item.id) === String(shop.id));
      if (exists) {
        return prev.filter((item) => String(item.id) !== String(shop.id));
      }
      return [...prev, shop];
    });
  };

  return (
    <WishlistContext.Provider value={{ savedItems, savedShops, toggleSave, toggleSaveShop }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
