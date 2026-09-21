import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext({
  cartItems: [],
  addToCart: () => {},
  incrementQuantity: () => {},
  decrementQuantity: () => {},
  updateQuantity: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
});

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('cartItems');
      const parsed = stored ? JSON.parse(stored) : [];
      return Array.isArray(parsed)
        ? parsed.map((item) => ({
            ...item,
            quantity: Math.max(1, Number(item.quantity) || 1),
          }))
        : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const getStockLimit = (item) => {
    const stock = Number(item.stock_quantity);
    return Number.isFinite(stock) && stock > 0 ? stock : null;
  };

  const addToCart = (product, quantity = 1) => {
    const requestedQuantity = Math.max(1, Math.floor(Number(quantity) || 1));

    setCartItems((prev) => {
      const existing = prev.find((item) => String(item.id) === String(product.id));
      if (existing) {
        const currentQuantity = Number(existing.quantity) || 1;
        const stockLimit = getStockLimit(existing);
        return prev.map((item) =>
          String(item.id) === String(product.id)
            ? {
                ...item,
                quantity: stockLimit
                  ? Math.min(stockLimit, currentQuantity + requestedQuantity)
                  : currentQuantity + requestedQuantity,
              }
            : item
        );
      }

      const stockLimit = getStockLimit(product);
      return [
        ...prev,
        {
          ...product,
          quantity: stockLimit ? Math.min(stockLimit, requestedQuantity) : requestedQuantity,
        },
      ];
    });
  };

  const incrementQuantity = (productId) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (String(item.id) !== String(productId)) return item;
        const currentQuantity = Number(item.quantity) || 1;
        const stockLimit = getStockLimit(item);
        return {
          ...item,
          quantity: stockLimit ? Math.min(stockLimit, currentQuantity + 1) : currentQuantity + 1,
        };
      })
    );
  };

  const decrementQuantity = (productId) => {
    setCartItems((prev) =>
      prev.map((item) =>
        String(item.id) === String(productId)
          ? { ...item, quantity: Math.max(1, (Number(item.quantity) || 1) - 1) }
          : item
      )
    );
  };

  const updateQuantity = (productId, quantity) => {
    const nextQuantity = Math.max(1, Math.floor(Number(quantity) || 1));
    setCartItems((prev) =>
      prev.map((item) => {
        if (String(item.id) !== String(productId)) return item;
        const stockLimit = getStockLimit(item);
        return {
          ...item,
          quantity: stockLimit ? Math.min(stockLimit, nextQuantity) : nextQuantity,
        };
      })
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => String(item.id) !== String(productId)));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        incrementQuantity,
        decrementQuantity,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
