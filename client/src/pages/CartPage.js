import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useTranslation } from "react-i18next";
import "../styles/CartPage.scss";

function CartPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    cartItems,
    removeFromCart,
    clearCart,
    updateQuantity,
    updatePallets,
    updatePieces, // ✅ new
    getTotalPrice,
  } = useCart();

  // 🔐 Auth check (JWT based)
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const handleCheckout = () => {
    if (!isLoggedIn) {
      navigate("/auth", { state: { from: "/checkout" } });
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="cart-page">
      <h1>{t("Coșul meu")}</h1>

      {cartItems.length === 0 ? (
        <p>{t("Coșul este gol")}</p>
      ) : (
        <>
          <ul className="cart-list">
            {cartItems.map((item) => {
              const quantity = Number(item.quantity || 0); // boxes
              const pallets = Number(item.pallets || 0);
              const pieces = Number(item.pieces || 0);
              const unitsPerBox = Number(item.unitsPerBox || 1);
              const boxPerPalet = Number(item.boxPerPalet || 0);
              const price = Number(item.price || 0);

              const palletUnits = pallets * boxPerPalet * unitsPerBox;
              const boxUnits = quantity * unitsPerBox;
              const totalUnits = boxUnits + palletUnits + pieces;
              const itemTotal = totalUnits * price;

              return (
                <li key={item._id} className="cart-item">
                  <img
                    src={`/images/produse/${item.image}`}
                    alt={item.name}
                    width="70"
                  />

                  <div className="cart-item-info">
                    <h3>{item.name}</h3>

                    <p>
                      {t("Preț / unitate")}:{" "}
                      <strong>{price.toFixed(2)} €</strong>
                    </p>

                    {/* Boxes */}
                    <div className="cart-field">
                      <label>{t("Cantitate (boxes)")}: </label>
                      <input
                        type="number"
                        min="0"
                        value={quantity}
                        onChange={(e) =>
                          updateQuantity(item._id, e.target.value)
                        }
                      />
                    </div>

                    {/* Pallets */}
                    <div className="cart-field">
                      <label>{t("Paleti")}: </label>
                      <input
                        type="number"
                        min="0"
                        value={pallets}
                        onChange={(e) =>
                          updatePallets(item._id, e.target.value)
                        }
                      />
                      <small>
                        1 {t("palet")} = {boxPerPalet} boxes
                      </small>
                    </div>

                    {/* Pieces */}
                    <div className="cart-field">
                      <label>{t("Bucăți")}: </label>
                      <input
                        type="number"
                        min="0"
                        value={pieces}
                        onChange={(e) =>
                          updatePieces(item._id, e.target.value)
                        }
                      />
                    </div>

                    <p>
                      {quantity} boxes × {unitsPerBox} {t("unități")}
                      {pallets > 0 &&
                        ` + ${pallets} ${t("paleti")} × ${boxPerPalet} boxes × ${unitsPerBox} ${t("unități")}`}
                      {pieces > 0 && ` + ${pieces} ${t("bucăți")}`}
                    </p>

                    <p className="item-total">
                      {t("Total produs")}: {itemTotal.toFixed(2)} €
                    </p>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item._id)}
                  >
                    {t("Șterge")}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Total */}
          <div className="cart-total">
            <h2>
              {t("Total comandă")}: {Number(getTotalPrice()).toFixed(2)} €
            </h2>
          </div>

          {/* Actions */}
          <div className="cart-actions">
            <button className="clear-cart-btn" onClick={clearCart}>
              {t("Șterge coșul")}
            </button>

            <button className="checkout-btn" onClick={handleCheckout}>
              {t("Finalizează comanda")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CartPage;