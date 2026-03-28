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
      try {
        const parsed = JSON.parse(savedCart);

        const normalizedCart = Array.isArray(parsed)
          ? parsed.map((item) => ({
              ...item,
              quantity: Number(item.quantity || 0),
              pallets: Number(item.pallets || 0),
              pieces: Number(item.pieces || 0),
              unitsPerBox: Number(item.unitsPerBox || 1),
              boxPerPalet: Number(item.boxPerPalet || 0),
              price: Number(item.price || 0),
            }))
          : [];

        setCartItems(normalizedCart);
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
  // ✅ Default behavior: add 1 piece, not 1 box
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
            ? {
                ...item,
                pieces: Number(item.pieces || 0) + 1,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          ...product,
          quantity: 0, // boxes
          pallets: 0,
          pieces: 1, // ✅ default add = 1 piece
          unitsPerBox: Number(product.unitsPerBox || 1),
          boxPerPalet: Number(product.boxPerPalet || 0),
          price: Number(product.price || 0),
        },
      ];
    });

    setCartAnimationTrigger((prev) => prev + 1);
  };

  const shouldRemoveItem = (item) => {
    const quantity = Number(item.quantity || 0);
    const pallets = Number(item.pallets || 0);
    const pieces = Number(item.pieces || 0);

    return quantity <= 0 && pallets <= 0 && pieces <= 0;
  };

  // ✏️ Update quantity directly (boxes)
  const updateQuantity = (productId, quantity) => {
    const q = Math.max(0, Number(quantity) || 0);

    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item._id !== productId) return item;
          if (isProductOutOfStock(item)) return item;

          return {
            ...item,
            quantity: q,
          };
        })
        .filter((item) => !shouldRemoveItem(item))
    );
  };

  // 🧱 Update pallets
  // ✅ Do not overwrite boxes
  const updatePallets = (productId, pallets) => {
    const p = Math.max(0, Number(pallets) || 0);

    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item._id !== productId) return item;
          if (isProductOutOfStock(item)) return item;

          return {
            ...item,
            pallets: p,
          };
        })
        .filter((item) => !shouldRemoveItem(item))
    );
  };

  // 🧩 Update pieces
  const updatePieces = (productId, pieces) => {
    const p = Math.max(0, Number(pieces) || 0);

    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item._id !== productId) return item;
          if (isProductOutOfStock(item)) return item;

          return {
            ...item,
            pieces: p,
          };
        })
        .filter((item) => !shouldRemoveItem(item))
    );
  };

  // ➖ Decrease by 1 piece first, then box if needed
  const decreaseQuantity = (productId) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item._id !== productId) return item;

          const pieces = Number(item.pieces || 0);
          const quantity = Number(item.quantity || 0);

          if (pieces > 0) {
            return { ...item, pieces: pieces - 1 };
          }

          if (quantity > 0) {
            return { ...item, quantity: quantity - 1 };
          }

          return item;
        })
        .filter((item) => !shouldRemoveItem(item))
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

  // 🔢 Cart badge count
  // ✅ Count total selectable purchase groups, not only boxes
  const getCartCount = () => {
    return cartItems.reduce((acc, item) => {
      const pieces = Number(item.pieces || 0);
      const boxes = Number(item.quantity || 0);
      const pallets = Number(item.pallets || 0);
      return acc + pieces + boxes + pallets;
    }, 0);
  };

  // 💰 FINAL TOTAL PRICE
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const pieces = Number(item.pieces || 0);
      const boxes = Number(item.quantity || 0);
      const pallets = Number(item.pallets || 0);
      const unitsPerBox = Number(item.unitsPerBox || 1);
      const boxPerPalet = Number(item.boxPerPalet || 0);
      const price = Number(item.price || 0);

      const pieceUnits = pieces;
      const boxUnits = boxes * unitsPerBox;
      const palletUnits = pallets * boxPerPalet * unitsPerBox;

      const totalUnits = pieceUnits + boxUnits + palletUnits;

      return total + totalUnits * price;
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