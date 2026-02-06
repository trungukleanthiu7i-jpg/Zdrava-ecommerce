import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/CartPage.scss";

function CartPage() {
  const navigate = useNavigate();

  const {
    cartItems,
    removeFromCart,
    clearCart,
    updateQuantity,
    updatePallets,
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
      <h1>Coșul meu</h1>

      {cartItems.length === 0 ? (
        <p>Coșul este gol</p>
      ) : (
        <>
          <ul className="cart-list">
            {cartItems.map((item) => {
              const quantity = Number(item.quantity || 0);
              const unitsPerBox = Number(item.unitsPerBox || 1);
              const price = Number(item.price || 0);

              const totalUnits = quantity * unitsPerBox;
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
                      Preț / unitate: <strong>{price.toFixed(2)} €</strong>
                    </p>

                    {/* Boxes */}
                    <div className="cart-field">
                      <label>Cantitate (boxes):</label>
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
                      <label>Paleti:</label>
                      <input
                        type="number"
                        min="0"
                        value={item.pallets || 0}
                        onChange={(e) =>
                          updatePallets(item._id, e.target.value)
                        }
                      />
                      <small>
                        1 palet = {item.boxPerPalet} boxes
                      </small>
                    </div>

                    <p>
                      {quantity} boxes × {unitsPerBox} unități
                    </p>

                    <p className="item-total">
                      Total produs: {itemTotal.toFixed(2)} €
                    </p>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item._id)}
                  >
                    Șterge
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Total */}
          <div className="cart-total">
            <h2>Total comandă: {Number(getTotalPrice()).toFixed(2)} €</h2>
          </div>

          {/* Actions */}
          <div className="cart-actions">
            <button className="clear-cart-btn" onClick={clearCart}>
              Șterge coșul
            </button>

            <button className="checkout-btn" onClick={handleCheckout}>
              Finalizează comanda
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CartPage;
