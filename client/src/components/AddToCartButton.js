import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { FaShoppingBasket } from "react-icons/fa";
import "../components/AddToCartButton.scss";

function AddToCartButton({ product, variant = "default" }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.stopPropagation();
    addToCart(product);

    // ✅ Redirect to all products page only when used on the single product page
    if (variant === "single") {
      navigate("/products"); // <-- change this path if your route differs
    }
  };

  return (
    <button className={`add-to-cart-btn ${variant}`} onClick={handleClick}>
      <FaShoppingBasket />
      {variant === "single" && <span>Adaugă în coș</span>}
    </button>
  );
}

export default AddToCartButton;
