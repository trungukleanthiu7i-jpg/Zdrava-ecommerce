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

function normalizeNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function normalizeCartItem(item) {
  return {
    ...item,
    quantity: Math.max(0, normalizeNumber(item.quantity, 0)), // boxes
    pallets: Math.max(0, normalizeNumber(item.pallets, 0)),
    pieces: Math.max(0, normalizeNumber(item.pieces, 0)),
    unitsPerBox: Math.max(1, normalizeNumber(item.unitsPerBox, 1)),
    boxPerPalet: Math.max(0, normalizeNumber(item.boxPerPalet, 0)),
    price: Math.max(0, normalizeNumber(item.price, 0)),
  };
}

function shouldKeepItem(item) {
  const normalized = normalizeCartItem(item);

  return (
    normalized.quantity > 0 ||
    normalized.pallets > 0 ||
    normalized.pieces > 0
  );
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartAnimationTrigger, setCartAnimationTrigger] = useState(0);

  // 🔁 Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");

    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);

        if (Array.isArray(parsed)) {
          setCartItems(parsed.map(normalizeCartItem));
        } else {
          setCartItems([]);
        }
      } catch (error) {
        console.error("Failed to parse cartItems from localStorage:", error);
        setCartItems([]);
      }
    }
  }, []);

  // 💾 Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // ➕ Add product to cart
  // default = 1 piece
  const addToCart = (product) => {
    if (!product || isProductOutOfStock(product)) return;

    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);

      if (existing) {
        if (isProductOutOfStock(existing) || isProductOutOfStock(product)) {
          return prev;
        }

        return prev.map((item) =>
          item._id === product._id
            ? normalizeCartItem({
                ...item,
                pieces: normalizeNumber(item.pieces, 0) + 1,
              })
            : normalizeCartItem(item)
        );
      }

      return [
        ...prev,
        normalizeCartItem({
          ...product,
          quantity: 0,
          pallets: 0,
          pieces: 1,
        }),
      ];
    });

    setCartAnimationTrigger((prev) => prev + 1);
  };

  // ✏️ Update boxes
  const updateQuantity = (productId, quantity) => {
    const q = Math.max(0, normalizeNumber(quantity, 0));

    setCartItems((prev) => {
      const updated = prev.map((item) => {
        if (item._id !== productId) return normalizeCartItem(item);
        if (isProductOutOfStock(item)) return normalizeCartItem(item);

        return normalizeCartItem({
          ...item,
          quantity: q,
        });
      });

      return updated.filter(shouldKeepItem);
    });
  };

  // 🧱 Update pallets
  const updatePallets = (productId, pallets) => {
    const p = Math.max(0, normalizeNumber(pallets, 0));

    setCartItems((prev) => {
      const updated = prev.map((item) => {
        if (item._id !== productId) return normalizeCartItem(item);
        if (isProductOutOfStock(item)) return normalizeCartItem(item);

        return normalizeCartItem({
          ...item,
          pallets: p,
        });
      });

      return updated.filter(shouldKeepItem);
    });
  };

  // 🧩 Update pieces
  const updatePieces = (productId, pieces) => {
    const p = Math.max(0, normalizeNumber(pieces, 0));

    setCartItems((prev) => {
      const updated = prev.map((item) => {
        if (item._id !== productId) return normalizeCartItem(item);
        if (isProductOutOfStock(item)) return normalizeCartItem(item);

        return normalizeCartItem({
          ...item,
          pieces: p,
        });
      });

      return updated.filter(shouldKeepItem);
    });
  };

  // ➖ Decrease piece first, then box
  const decreaseQuantity = (productId) => {
    setCartItems((prev) => {
      const updated = prev.map((item) => {
        if (item._id !== productId) return normalizeCartItem(item);

        const normalized = normalizeCartItem(item);

        if (normalized.pieces > 0) {
          return normalizeCartItem({
            ...normalized,
            pieces: normalized.pieces - 1,
          });
        }

        if (normalized.quantity > 0) {
          return normalizeCartItem({
            ...normalized,
            quantity: normalized.quantity - 1,
          });
        }

        if (normalized.pallets > 0) {
          return normalizeCartItem({
            ...normalized,
            pallets: normalized.pallets - 1,
          });
        }

        return normalized;
      });

      return updated.filter(shouldKeepItem);
    });
  };

  // ❌ Remove product completely
  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== productId));
  };

  // 🧹 Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // 🔢 Cart badge count
  const getCartCount = () => {
    return cartItems.reduce((acc, item) => {
      const normalized = normalizeCartItem(item);

      return (
        acc +
        normalized.pieces +
        normalized.quantity +
        normalized.pallets
      );
    }, 0);
  };

  // 💰 Total price
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const normalized = normalizeCartItem(item);

      const pieceUnits = normalized.pieces;
      const boxUnits = normalized.quantity * normalized.unitsPerBox;
      const palletUnits =
        normalized.pallets *
        normalized.boxPerPalet *
        normalized.unitsPerBox;

      const totalUnits = pieceUnits + boxUnits + palletUnits;

      return total + totalUnits * normalized.price;
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
        updatePieces,
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