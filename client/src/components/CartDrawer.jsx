import React, { useState, useEffect, useContext } from "react";
import "../styles/CartDrawer.scss";
import { useCart } from "../context/CartContext";
import { UserContext } from "../context/UserContext";
import { FaShoppingCart, FaPlus, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CartDrawer = () => {
  const {
    cartItems,
    addToCart,
    removeFromCart,
    getTotalPrice,
    cartAnimationTrigger,
  } = useCart();

  const { user } = useContext(UserContext);
  const isAdmin = user?.role === "admin";

  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [cartAnimation, setCartAnimation] = useState(false);
  const navigate = useNavigate();

  // 🌀 Sync animation with global cart trigger (clients only)
  useEffect(() => {
    if (!isAdmin && cartAnimationTrigger > 0) {
      setCartAnimation(true);
      setTimeout(() => setCartAnimation(false), 400);
    }
  }, [cartAnimationTrigger, isAdmin]);

  // 🧭 Smooth navigation with drawer fade out
  const handleGoToCart = () => {
    if (isAdmin) return;
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
      navigate("/cart");
    }, 400);
  };

  // 🌫️ Smooth close when overlay clicked
  const handleOverlayClick = () => {
    if (isAdmin) return;
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 400);
  };

  return (
    <>
      {/* 🛒 Floating Cart Button */}
      <button
        className={`floating-cart-btn ${
          cartAnimation ? "cart-bounce" : ""
        } ${isAdmin ? "disabled" : ""}`}
        onClick={() => !isAdmin && setOpen(!open)}
        title={isAdmin ? "Disabled in admin mode" : "Open cart"}
        disabled={isAdmin}
      >
        <FaShoppingCart className="cart-icon" />

        {/* ❌ Hide counter for admin */}
        {!isAdmin && cartItems.length > 0 && (
          <span className="cart-count">{cartItems.length}</span>
        )}
      </button>

      {/* 🌫️ Overlay (clients only) */}
      {!isAdmin && open && (
        <div
          className={`cart-overlay ${closing ? "fade-out" : "fade-in"}`}
          onClick={handleOverlayClick}
        ></div>
      )}

      {/* 🧾 Drawer (clients only) */}
      {!isAdmin && (
        <div
          className={`cart-drawer ${open ? "open" : ""} ${
            closing ? "closing" : ""
          }`}
        >
          <div className="cart-drawer__header">
            <h3>🛍️ Coșul Tău</h3>
            <button onClick={handleOverlayClick}>✕</button>
          </div>

          {cartItems.length === 0 ? (
            <p className="empty-cart">Coșul este gol</p>
          ) : (
            <>
              <ul className="cart-drawer__list">
                {cartItems.map((item) => (
                  <li key={item._id} className="cart-drawer__item">
                    <img
                      src={
                        item.image?.startsWith("/images")
                          ? item.image
                          : `/images/produse/${item.image}`
                      }
                      alt={item.name}
                    />
                    <div className="cart-drawer__info">
                      <h4>{item.name}</h4>
                      <p>
                        {item.price} RON × {item.quantity}
                      </p>
                      <strong>
                        {(item.price * item.quantity).toFixed(2)} RON
                      </strong>
                    </div>
                    <div className="cart-drawer__actions">
                      <button onClick={() => removeFromCart(item._id)}>
                        <FaTrash />
                      </button>
                      <button onClick={() => addToCart(item)}>
                        <FaPlus />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {/* 🧮 Footer Section */}
              <div className="cart-drawer__footer">
                <h3>Total: {getTotalPrice().toFixed(2)} RON</h3>

                <div className="drawer-buttons">
                  <button className="go-to-cart-btn" onClick={handleGoToCart}>
                    Go to Cart
                  </button>
                  <button className="checkout-btn">Checkout</button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default CartDrawer;
