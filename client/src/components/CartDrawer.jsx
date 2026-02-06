import React, { useState, useEffect, useContext } from "react";
import "../styles/CartDrawer.scss";
import { useCart } from "../context/CartContext";
import { UserContext } from "../context/UserContext";
import { FaShoppingCart, FaPlus, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CartDrawer = () => {
  const { t } = useTranslation();

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

  /* 🌀 Cart animation (clients only) */
  useEffect(() => {
    if (!isAdmin && cartAnimationTrigger > 0) {
      setCartAnimation(true);
      setTimeout(() => setCartAnimation(false), 400);
    }
  }, [cartAnimationTrigger, isAdmin]);

  /* 🧭 Go to Cart */
  const handleGoToCart = () => {
    if (isAdmin) return;
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
      navigate("/cart");
    }, 400);
  };

  /* ✅ Checkout logic (AUTH AWARE) */
  const handleCheckout = () => {
    if (isAdmin || cartItems.length === 0) return;

    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);

      if (!user) {
        navigate("/auth"); // ❌ not logged in
      } else {
        navigate("/checkout"); // ✅ logged in
      }
    }, 400);
  };

  /* 🌫️ Close drawer */
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
      {/* 🛒 Floating Cart Button (HIDDEN when drawer open) */}
      {!open && (
        <button
          className={`floating-cart-btn ${
            cartAnimation ? "cart-bounce" : ""
          } ${isAdmin ? "disabled" : ""}`}
          onClick={() => !isAdmin && setOpen(true)}
          disabled={isAdmin}
          title={isAdmin ? "Disabled in admin mode" : "Open cart"}
        >
          <FaShoppingCart className="cart-icon" />

          {!isAdmin && cartItems.length > 0 && (
            <span className="cart-count">{cartItems.length}</span>
          )}
        </button>
      )}

      {/* 🌫️ Overlay */}
      {!isAdmin && open && (
        <div
          className={`cart-overlay ${closing ? "fade-out" : "fade-in"}`}
          onClick={handleOverlayClick}
        />
      )}

      {/* 🧾 Cart Drawer */}
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
                        {item.price} € × {item.quantity}
                      </p>
                      <strong>
                        {(item.price * item.quantity).toFixed(2)} €
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

              {/* 🧮 Footer */}
              <div className="cart-drawer__footer">
                {/* ✅ changed RON -> € */}
                <h3>Total: {getTotalPrice().toFixed(2)} €</h3>

                <div className="drawer-buttons">
                  <button className="go-to-cart-btn" onClick={handleGoToCart}>
                    {t("Go to cart")}
                  </button>

                  <button className="checkout-btn" onClick={handleCheckout}>
                    {t("Checkout")}
                  </button>
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
