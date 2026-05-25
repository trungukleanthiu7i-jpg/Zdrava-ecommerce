import React, { useState, useEffect, useContext } from "react";
import "../styles/CartDrawer.scss";
import { useCart } from "../context/CartContext";
import { UserContext } from "../context/UserContext";
import { FaShoppingCart, FaPlus, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const EUR_TO_RON = 5.25;

const CartDrawer = () => {
  const { t } = useTranslation();

  const {
    cartItems,
    addToCart,
    removeFromCart,
    getTotalPrice,
    getCartCount,
    cartAnimationTrigger,
  } = useCart();

  const { user } = useContext(UserContext);
  const isAdmin = user?.role === "admin";

  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [cartAnimation, setCartAnimation] = useState(false);
  const navigate = useNavigate();

  const getItemUnits = (item) => {
    const pieces = Number(item.pieces || 0);
    const boxes = Number(item.quantity || 0);
    const pallets = Number(item.pallets || 0);
    const unitsPerBox = Number(item.unitsPerBox || 1);
    const boxPerPalet = Number(item.boxPerPalet || 0);

    return pieces + boxes * unitsPerBox + pallets * boxPerPalet * unitsPerBox;
  };

  const getItemBreakdown = (item) => {
    const pieces = Number(item.pieces || 0);
    const boxes = Number(item.quantity || 0);
    const pallets = Number(item.pallets || 0);

    const parts = [];

    if (pieces > 0) parts.push(`${pieces} buc`);
    if (boxes > 0) parts.push(`${boxes} cutii`);
    if (pallets > 0) parts.push(`${pallets} paleți`);

    return parts.join(" + ");
  };

  useEffect(() => {
    if (!isAdmin && cartAnimationTrigger > 0) {
      setCartAnimation(true);
      setTimeout(() => setCartAnimation(false), 400);
    }
  }, [cartAnimationTrigger, isAdmin]);

  const handleGoToCart = () => {
    if (isAdmin) return;
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
      navigate("/cart");
    }, 400);
  };

  const handleCheckout = () => {
    if (isAdmin || cartItems.length === 0) return;

    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);

      if (!user) {
        navigate("/auth");
      } else {
        navigate("/checkout");
      }
    }, 400);
  };

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

          {!isAdmin && getCartCount() > 0 && (
            <span className="cart-count">{getCartCount()}</span>
          )}
        </button>
      )}

      {!isAdmin && open && (
        <div
          className={`cart-overlay ${closing ? "fade-out" : "fade-in"}`}
          onClick={handleOverlayClick}
        />
      )}

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
                {cartItems.map((item) => {
                  const totalUnits = getItemUnits(item);
                  const breakdown = getItemBreakdown(item);
                  const price = Number(item.price || 0);
                  const itemTotal = price * totalUnits;

                  return (
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
                          {price.toFixed(2)} € /{" "}
                          {(price * EUR_TO_RON).toFixed(2)} lei × {totalUnits}
                        </p>

                        {breakdown && <small>{breakdown}</small>}

                        <strong>
                          {itemTotal.toFixed(2)} € /{" "}
                          {(itemTotal * EUR_TO_RON).toFixed(2)} lei
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
                  );
                })}
              </ul>

              <div className="cart-drawer__footer">
                <h3>
                  Total: {Number(getTotalPrice()).toFixed(2)} € /{" "}
                  {(Number(getTotalPrice()) * EUR_TO_RON).toFixed(2)} lei
                </h3>

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
