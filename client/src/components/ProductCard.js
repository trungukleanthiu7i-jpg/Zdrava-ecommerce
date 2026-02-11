import React from "react";
import { Link } from "react-router-dom";
import "./ProductCard.scss";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img
        src={`${API}${product.image}`}
        alt={product.name}
        className="product-image"
      />
      <h3>{product.name}</h3>
      <p className="price">{product.price} RON</p>
      <Link to={`/product/${product._id}`}>
        <button className="read-more">Read More</button>
      </Link>
    </div>
  );
}

export default ProductCard;
