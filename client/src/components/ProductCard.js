import React from "react";
import { Link } from "react-router-dom";
import "./ProductCard.scss";

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img src={`http://localhost:5000${product.image}`} alt={product.name} className="product-image" />
      <h3>{product.name}</h3>
      <p className="price">{product.price} RON</p>
      <Link to={`/product/${product._id}`}>
        <button className="read-more">Read More</button>
      </Link>
    </div>
  );
}

export default ProductCard;
