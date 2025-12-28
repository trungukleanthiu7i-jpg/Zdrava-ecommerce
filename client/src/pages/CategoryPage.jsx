import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/AllProductsPage.scss";
import { useCart } from "../context/CartContext";
import { FaShoppingBasket } from "react-icons/fa";

const CategoryPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate(); // ✅ this must come from react-router-dom

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/products/category/${category}`
        );
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching category products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryProducts();
  }, [category]);

  return (
    <div className="all-products-page">
      <h1 style={{ textTransform: "capitalize" }}>{category}</h1>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found for this category.</p>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div
              key={product._id}
              className="product-card"
              onClick={() => {
                console.log("Navigating to product:", product._id);
                navigate(`/product/${product._id}`); // ✅ go to single product page
              }}
              style={{ cursor: "pointer" }}
            >
              <img
                src={`/images/produse/${product.image}`}
                alt={product.name}
              />
              <h3>{product.name}</h3>
              <p>{product.price} RON</p>

              <button
                className="add-to-cart-btn"
                onClick={(e) => {
                  e.stopPropagation(); // ✅ prevent redirect when clicking button
                  addToCart(product);
                }}
              >
                <FaShoppingBasket />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
