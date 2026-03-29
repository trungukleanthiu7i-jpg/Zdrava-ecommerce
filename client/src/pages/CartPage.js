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
    updatePieces,
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

  const handleNumberChange = (callback, id, value) => {
    const safeValue = Math.max(0, Number(value) || 0);
    callback(id, safeValue);
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
              const boxes = Number(item.quantity || 0);
              const pallets = Number(item.pallets || 0);
              const pieces = Number(item.pieces || 0);
              const unitsPerBox = Number(item.unitsPerBox || 1);
              const boxPerPalet = Number(item.boxPerPalet || 0);
              const price = Number(item.price || 0);

              const pieceUnits = pieces;
              const boxUnits = boxes * unitsPerBox;
              const palletUnits = pallets * boxPerPalet * unitsPerBox;
              const totalUnits = pieceUnits + boxUnits + palletUnits;
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

                    {/* Pieces */}
                    <div className="cart-field">
                      <label>{t("Bucăți")}: </label>
                      <input
                        type="number"
                        min="0"
                        value={pieces}
                        onChange={(e) =>
                          handleNumberChange(
                            updatePieces,
                            item._id,
                            e.target.value
                          )
                        }
                      />
                    </div>

                    {/* Boxes */}
                    <div className="cart-field">
                      <label>{t("Cantitate (boxes)")}: </label>
                      <input
                        type="number"
                        min="0"
                        value={boxes}
                        onChange={(e) =>
                          handleNumberChange(
                            updateQuantity,
                            item._id,
                            e.target.value
                          )
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
                          handleNumberChange(
                            updatePallets,
                            item._id,
                            e.target.value
                          )
                        }
                      />
                      <small>
                        1 {t("palet")} = {boxPerPalet} boxes
                      </small>
                    </div>

                    <p>
                      {pieces > 0 && `${pieces} ${t("bucăți")}`}
                      {boxes > 0 &&
                        `${pieces > 0 ? " + " : ""}${boxes} boxes × ${unitsPerBox} ${t("unități")}`}
                      {pallets > 0 &&
                        `${pieces > 0 || boxes > 0 ? " + " : ""}${pallets} ${t(
                          "paleti"
                        )} × ${boxPerPalet} boxes × ${unitsPerBox} ${t(
                          "unități"
                        )}`}
                      {totalUnits === 0 && `0 ${t("bucăți")}`}
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

          <div className="cart-total">
            <h2>
              {t("Total comandă")}: {Number(getTotalPrice()).toFixed(2)} €
            </h2>
          </div>

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