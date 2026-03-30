import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
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
  const [addedItems, setAddedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const API = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const productsPerPage = 12;

  // ✅ Read category from URL query
  const queryCategory = new URLSearchParams(location.search).get("category");
  const validCategory =
    CATEGORIES.find((c) => c.key === queryCategory)?.key || CATEGORIES[0].key;

  const [activeCategory, setActiveCategory] = useState(validCategory);

  /* ================================
     SYNC CATEGORY WITH URL
  ================================ */
  useEffect(() => {
    if (queryCategory && CATEGORIES.some((c) => c.key === queryCategory)) {
      setActiveCategory(queryCategory);
    } else if (!queryCategory) {
      setActiveCategory(CATEGORIES[0].key);
    }
  }, [queryCategory]);

  /* ================================
     FETCH PRODUCTS BY CATEGORY
  ================================ */
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      try {
        const res = await axios.get(
          `${API}/api/products?category=${encodeURIComponent(activeCategory)}`
        );
        setProducts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Fetch products error:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [API, activeCategory]);

  /* ================================
     RESET PAGE WHEN CATEGORY CHANGES
  ================================ */
  useEffect(() => {
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeCategory]);

  /* ================================
     PAGINATION
  ================================ */
  const totalPages = Math.ceil(products.length / productsPerPage) || 1;

  const currentProducts = useMemo(() => {
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    return products.slice(indexOfFirstProduct, indexOfLastProduct);
  }, [products, currentPage]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ================================
     CATEGORY CLICK
  ================================ */
  const handleCategoryClick = (categoryKey) => {
    setActiveCategory(categoryKey);
    navigate(`/products?category=${encodeURIComponent(categoryKey)}`);
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
     IMAGE URL
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
                onClick={() => handleCategoryClick(cat.key)}
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
              <div className="all-products-count">{products.length} produse</div>
            )}
          </div>

          {loading ? (
            <p>Loading products...</p>
          ) : (
            <>
              {products.length === 0 ? (
                <div className="no-products-message">
                  <p>Nu există produse în această categorie momentan.</p>
                </div>
              ) : (
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
                        <img
                          src={getImageUrl(product.image)}
                          alt={product.name}
                          loading="lazy"
                        />

                        <h3>{product.name}</h3>

                        <p className="price">
                          €{Number(product.price || 0).toFixed(2)}
                        </p>

                        {product.barcode && <Barcode value={product.barcode} />}

                        <div
                          className={`stock-status ${
                            isOutOfStock ? "out" : "in"
                          }`}
                        >
                          {isOutOfStock ? "Out of stock" : "In stock"}
                        </div>

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
              )}

              {products.length > productsPerPage && (
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