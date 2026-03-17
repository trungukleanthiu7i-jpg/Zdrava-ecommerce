import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import "../styles/SearchResults.scss";
import { useCart } from "../context/CartContext";
import { FaShoppingCart, FaCheck } from "react-icons/fa";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const [addedItems, setAddedItems] = useState([]);
  const location = useLocation();
  const { addToCart } = useCart();

  const query = new URLSearchParams(location.search).get("query") || "";

  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return `${process.env.PUBLIC_URL}/images/no-image.png`;
    }

    // already full URL
    if (
      imagePath.startsWith("http://") ||
      imagePath.startsWith("https://")
    ) {
      return imagePath;
    }

    // backend already sends something like /images/produse/file.jpg
    if (imagePath.startsWith("/images/")) {
      return `${API}${imagePath}`;
    }

    // most common case in your app: only filename stored
    return `${API}/images/produse/${imagePath}`;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${API}/api/products/search?query=${encodeURIComponent(query)}`
        );
        setProducts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching search results:", err);
        setProducts([]);
      }
    };

    if (query.trim()) {
      fetchProducts();
    } else {
      setProducts([]);
    }
  }, [query]);

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedItems((prev) => [...prev, product._id]);

    setTimeout(() => {
      setAddedItems((prev) => prev.filter((id) => id !== product._id));
    }, 1000);
  };

  return (
    <div className="search-results">
      <h2>
        Search results for: <span>"{query}"</span>
      </h2>

      <div className="product-grid">
        {products.length > 0 ? (
          products.map((p) => (
            <div key={p._id} className="product-card">
              <Link to={`/product/${p._id}`}>
                <img
                  src={getImageUrl(p.image)}
                  alt={p.name}
                  onError={(e) => {
                    e.currentTarget.src = `${process.env.PUBLIC_URL}/images/no-image.png`;
                  }}
                />
                <div className="overlay">View Product</div>
              </Link>

              <h3>{p.name}</h3>

              <div className="price-add">
                <span className="price">
                  {Number(p.price || 0).toFixed(2)} €
                </span>

                <button
                  className={`add-btn ${
                    addedItems.includes(p._id) ? "added" : ""
                  }`}
                  onClick={() => handleAddToCart(p)}
                  title="Add to Cart"
                >
                  {addedItems.includes(p._id) ? <FaCheck /> : <FaShoppingCart />}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;