import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

function isProductOutOfStock(product) {
  if (!product) return true;

  const stockState = String(product.stockState || product.stock || "")
    .trim()
    .toLowerCase();

  const blockedStates = [
    "out_of_stock",
    "out of stock",
    "stoc epuizat",
    "unavailable",
    "unavailable for sale",
    "sold out",
  ];

  if (blockedStates.includes(stockState)) return true;

  const numericCandidates = [
    product.countInStock,
    product.stockQuantity,
    product.quantityInStock,
    product.availableStock,
  ];

  const hasNumericStock = numericCandidates.some(
    (value) => value !== undefined && value !== null && value !== ""
  );

  if (hasNumericStock) {
    const numericStock = Number(
      numericCandidates.find(
        (value) => value !== undefined && value !== null && value !== ""
      )
    );

    if (!Number.isNaN(numericStock) && numericStock <= 0) {
      return true;
    }
  }

  return false;
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartAnimationTrigger, setCartAnimationTrigger] = useState(0);

  // 🔁 Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // 💾 Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // ➕ Add product to cart
  const addToCart = (product) => {
    if (!product || isProductOutOfStock(product)) {
      return;
    }

    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);

      if (existing) {
        if (isProductOutOfStock(existing) || isProductOutOfStock(product)) {
          return prev;
        }

        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...prev,
        {
          ...product,
          quantity: 1, // boxes
          pallets: 0,
        },
      ];
    });

    setCartAnimationTrigger((prev) => prev + 1);
  };

  // ✏️ Update quantity directly (boxes)
  const updateQuantity = (productId, quantity) => {
    const q = Math.max(0, Number(quantity) || 0);

    setCartItems((prev) =>
      q === 0
        ? prev.filter((item) => item._id !== productId)
        : prev.map((item) => {
            if (item._id !== productId) return item;
            if (isProductOutOfStock(item)) return item;

            return {
              ...item,
              quantity: q,
              pallets: 0, // reset pallets when editing boxes
            };
          })
    );
  };

  // 🧱 Update pallets (B2B logic)
  const updatePallets = (productId, pallets) => {
    const p = Math.max(0, Number(pallets) || 0);

    setCartItems((prev) =>
      prev.map((item) => {
        if (item._id !== productId) return item;
        if (isProductOutOfStock(item)) return item;

        return {
          ...item,
          pallets: p,
          quantity: p * item.boxPerPalet, // ✅ product-specific
        };
      })
    );
  };

  // ➖ Decrease quantity by 1 box
  const decreaseQuantity = (productId) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item._id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // ❌ Remove product completely
  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== productId));
  };

  // 🧹 Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // 🔢 Total boxes count
  const getCartCount = () => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  };

  // 💰 FINAL TOTAL PRICE (exact)
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const units = item.quantity * item.unitsPerBox; // boxes → units
      return total + units * item.price;
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        decreaseQuantity,
        updateQuantity,
        updatePallets,
        removeFromCart,
        clearCart,
        getCartCount,
        getTotalPrice,
        cartAnimationTrigger,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}