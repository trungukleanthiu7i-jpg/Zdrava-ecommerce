import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/AllProductsPage.scss";
import { useCart } from "../context/CartContext";
import { FaShoppingBasket, FaCheck } from "react-icons/fa";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

const CATEGORY_LABELS = {
  // HORECA
  "legume-conservate-horeca": "Legume conservate HORECA",
  "sosuri-horeca": "Sosuri HORECA",
  dulceturi: "Dulcețuri",

  // SUPERMARKET
  "legume-conservate": "Legume conservate",
  "produse-din-branza": "Produse din brânză",
  "dulciuri-si-snacks-uri": "Dulciuri și snacks-uri",
  "cafea-si-bauturi": "Cafea și băuturi",
  sosuri: "Sosuri",
  masline: "Măsline",
  "alimente-cu-amidon": "Alimente cu amidon",
  placinta: "Plăcintă",
};

const CategoryPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [addedItems, setAddedItems] = useState([]);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${API}/api/products/category/${category}`
        );
        setProducts(res.data || []);
      } catch (error) {
        console.error("Error fetching category products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [category]);

  // ✅ Nice title (Romanian) instead of slug
  const pageTitle = useMemo(() => {
    return CATEGORY_LABELS[category] || category;
  }, [category]);

  // ✅ Correct image URL (works for both old + new DB formats)
  const getImageUrl = (imagePath) => {
    if (!imagePath) return `${process.env.PUBLIC_URL}/images/no-image.png`;

    // New backend format: "/uploads/xxx.jpg" OR "/images/produse/xxx.jpg"
    if (imagePath.startsWith("/")) return `${API}${imagePath}`;

    // Old format: "xxx.jpg"
    return `${API}/images/produse/${imagePath}`;
  };

  // ✅ Add to cart with animation + block out-of-stock
  const handleAddToCart = (e, product) => {
    e.stopPropagation();

    if (product.stock === "out of stock") return;

    addToCart(product);
    setAddedItems((prev) => [...prev, product._id]);

    setTimeout(() => {
      setAddedItems((prev) => prev.filter((id) => id !== product._id));
    }, 900);
  };

  return (
    <div className="all-products-page">
      <div className="all-products-header">
        <h1>{pageTitle}</h1>
        {!loading && (
          <div className="all-products-count">{products.length} produse</div>
        )}
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found for this category.</p>
      ) : (
        <div className="products-grid">
          {products.map((product) => {
            const isOutOfStock = product.stock === "out of stock";

            return (
              <div
                key={product._id}
                className={`product-card ${isOutOfStock ? "out-of-stock" : ""}`}
                onClick={() => navigate(`/product/${product._id}`)}
                style={{ cursor: "pointer" }}
              >
                <img src={getImageUrl(product.image)} alt={product.name} />

                <h3>{product.name}</h3>

                <p className="price">
                  €{Number(product.price || 0).toFixed(2)}
                </p>

                <div className={`stock-status ${isOutOfStock ? "out" : "in"}`}>
                  {isOutOfStock ? "Out of stock" : "In stock"}
                </div>

                <button
                  className={`add-to-cart-btn ${
                    addedItems.includes(product._id) ? "added" : ""
                  } ${isOutOfStock ? "disabled" : ""}`}
                  onClick={(e) => handleAddToCart(e, product)}
                  disabled={isOutOfStock}
                  title={isOutOfStock ? "Out of stock" : "Add to cart"}
                >
                  {addedItems.includes(product._id) ? (
                    <FaCheck />
                  ) : (
                    <FaShoppingBasket />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
