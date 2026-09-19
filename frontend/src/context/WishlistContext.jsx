import React, { createContext, useContext, useState, useEffect } from 'react';

// Context for saved (wishlist) products
const WishlistContext = createContext({
  savedItems: [],
  toggleSave: () => {},
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

  useEffect(() => {
    localStorage.setItem('wishlistItems', JSON.stringify(savedItems));
  }, [savedItems]);

  const toggleSave = (product) => {
    setSavedItems((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  return (
    <WishlistContext.Provider value={{ savedItems, toggleSave }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
