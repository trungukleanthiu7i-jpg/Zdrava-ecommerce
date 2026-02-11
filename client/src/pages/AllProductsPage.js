import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FaShoppingBasket, FaCheck } from "react-icons/fa";
import {
  FaConciergeBell,
  FaPepperHot,
  FaCookieBite,
  FaCarrot,
  FaCheese,
  FaShoppingBag,
  FaCoffee,
  FaSeedling,
  FaBreadSlice,
  FaPizzaSlice,
} from "react-icons/fa";
import JsBarcode from "jsbarcode";
import "../styles/AllProductsPage.scss";

/* ================================
   BARCODE COMPONENT
================================ */
function Barcode({ value }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (svgRef.current && value) {
      JsBarcode(svgRef.current, String(value), {
        format: "CODE128",
        width: 1.6,
        height: 45,
        displayValue: false,
      });
    }
  }, [value]);

  return (
    <div className="barcode-wrapper" onClick={(e) => e.stopPropagation()}>
      <svg ref={svgRef}></svg>
      <p className="barcode-number">{value}</p>
    </div>
  );
}

/* ================================
   CATEGORIES (LEFT SIDEBAR)
================================ */
const CATEGORIES = [
  // ===== SUPERMARKET =====
  {
    key: "legume-conservate",
    label: "Legume conservate",
    icon: <FaCarrot />,
  },
  {
    key: "produse-din-branza",
    label: "Produse din brânză",
    icon: <FaCheese />,
  },
  {
    key: "dulciuri-si-snacks-uri",
    label: "Dulciuri și snacks-uri",
    icon: <FaShoppingBag />,
  },
  {
    key: "cafea-si-bauturi",
    label: "Cafea și băuturi",
    icon: <FaCoffee />,
  },
  {
    key: "sosuri",
    label: "Sosuri",
    icon: <FaPepperHot />,
  },
  {
    key: "masline",
    label: "Măsline",
    icon: <FaSeedling />,
  },
  {
    key: "alimente-cu-amidon",
    label: "Alimente cu amidon",
    icon: <FaBreadSlice />,
  },
  {
    key: "placinta",
    label: "Plăcintă",
    icon: <FaPizzaSlice />,
  },

  // ===== HORECA =====
  {
    key: "legume-conservate-horeca",
    label: "Legume conservate HORECA",
    icon: <FaConciergeBell />,
  },
  {
    key: "sosuri-horeca",
    label: "Sosuri HORECA",
    icon: <FaPepperHot />,
  },
  {
    key: "dulceturi",
    label: "Dulcețuri",
    icon: <FaCookieBite />,
  },
];

/* ================================
   MAIN PAGE
================================ */
function AllProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ default: show first category products on open
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].key);

  // pagination for the FILTERED list
  const [currentPage, setCurrentPage] = useState(1);
  const [addedItems, setAddedItems] = useState([]);

  const productsPerPage = 12;
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // ✅ Use deployed backend on Render, localhost in development
  const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

  /* ================================
     FETCH PRODUCTS
  ================================ */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API}/api/products`);
        setProducts(res.data || []);
      } catch (err) {
        console.error("Fetch products error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [API]);

  /* ================================
     FILTER BY CATEGORY
  ================================ */
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const cat = (p.category || "").toLowerCase();
      return cat === activeCategory.toLowerCase();
    });
  }, [products, activeCategory]);

  // Reset page when category changes
  useEffect(() => {
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeCategory]);

  /* ================================
     PAGINATION (FILTERED)
  ================================ */
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage) || 1;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ================================
     ADD TO CART
  ================================ */
  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    if (product.stock === "out of stock") return;

    addToCart(product);
    setAddedItems((prev) => [...prev, product._id]);

    setTimeout(() => {
      setAddedItems((prev) => prev.filter((id) => id !== product._id));
    }, 1000);
  };

  /* ================================
     IMAGE URL (PRODUCTION SAFE)
     Backend returns image like "/images/produse/filename.jpg"
================================ */
  const getImageUrl = (imagePath) => {
    if (!imagePath) return `${process.env.PUBLIC_URL}/images/no-image.png`;
    if (imagePath.startsWith("/")) return `${API}${imagePath}`;
    return `${API}/images/produse/${imagePath}`;
  };

  const activeLabel =
    CATEGORIES.find((c) => c.key === activeCategory)?.label || "Produse";

  return (
    <div className="all-products-layout">
      {/* ✅ NEW: INNER WRAPPER (keeps content centered, background stays full width) */}
      <div className="all-products-layout__inner">
        {/* LEFT SIDEBAR */}
        <aside className="category-sidebar">
          <h3 className="category-sidebar__title">Categorii</h3>

          <div className="category-sidebar__list">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                type="button"
                className={`category-item ${
                  activeCategory === cat.key ? "active" : ""
                }`}
                onClick={() => setActiveCategory(cat.key)}
              >
                <span className="category-item__icon">{cat.icon}</span>
                <span className="category-item__label">{cat.label}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* RIGHT CONTENT */}
        <main className="all-products-page">
          <div className="all-products-header">
            <h1>{activeLabel}</h1>
            {!loading && (
              <div className="all-products-count">
                {filteredProducts.length} produse
              </div>
            )}
          </div>

          {loading ? (
            <p>Loading products...</p>
          ) : (
            <>
              <div className="products-grid">
                {currentProducts.map((product) => {
                  const isOutOfStock = product.stock === "out of stock";

                  return (
                    <div
                      key={product._id}
                      className={`product-card ${
                        isOutOfStock ? "out-of-stock" : ""
                      }`}
                      onClick={() => navigate(`/product/${product._id}`)}
                    >
                      {/* IMAGE */}
                      <img src={getImageUrl(product.image)} alt={product.name} />

                      {/* NAME */}
                      <h3>{product.name}</h3>

                      {/* PRICE (EUR) */}
                      <p className="price">
                        €{Number(product.price || 0).toFixed(2)}
                      </p>

                      {/* BARCODE */}
                      {product.barcode && <Barcode value={product.barcode} />}

                      {/* STOCK STATUS */}
                      <div
                        className={`stock-status ${isOutOfStock ? "out" : "in"}`}
                      >
                        {isOutOfStock ? "Out of stock" : "In stock"}
                      </div>

                      {/* ADD TO CART */}
                      <button
                        className={`add-to-cart-btn ${
                          addedItems.includes(product._id) ? "added" : ""
                        } ${isOutOfStock ? "disabled" : ""}`}
                        onClick={(e) => handleAddToCart(e, product)}
                        disabled={isOutOfStock}
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

              {/* PAGINATION */}
              {filteredProducts.length > productsPerPage && (
                <div className="pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    &laquo; Previous
                  </button>

                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      className={currentPage === index + 1 ? "active" : ""}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next &raquo;
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default AllProductsPage;
