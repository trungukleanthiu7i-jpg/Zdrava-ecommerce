import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FaShoppingBasket, FaCheck } from "react-icons/fa";
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
    <div
      className="barcode-wrapper"
      onClick={(e) => e.stopPropagation()}
    >
      <svg ref={svgRef}></svg>
      <p className="barcode-number">{value}</p>
    </div>
  );
}

/* ================================
   MAIN PAGE
================================ */
function AllProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [addedItems, setAddedItems] = useState([]);

  const productsPerPage = 12;
  const navigate = useNavigate();
  const { addToCart } = useCart();

  /* ================================
     FETCH PRODUCTS
  ================================ */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/products"
        );
        setProducts(res.data);
      } catch (err) {
        console.error("Fetch products error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* ================================
     PAGINATION
  ================================ */
  const totalPages = Math.ceil(products.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ================================
     ADD TO CART
  ================================ */
  const handleAddToCart = (e, product) => {
    e.stopPropagation();

    // ❌ BLOCK if out of stock
    if (product.stock === "out of stock") return;

    addToCart(product);
    setAddedItems((prev) => [...prev, product._id]);

    setTimeout(() => {
      setAddedItems((prev) =>
        prev.filter((id) => id !== product._id)
      );
    }, 1000);
  };

  /* ================================
     IMAGE URL (CORRECT)
  ================================ */
  const getImageUrl = (image) => {
    if (!image) {
      return `${process.env.PUBLIC_URL}/images/no-image.png`;
    }
    return `http://localhost:5000/images/produse/${image}`;
  };

  return (
    <div className="all-products-page">
      <h1>Toate produsele</h1>

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <>
          <div className="products-grid">
            {currentProducts.map((product) => {
              const isOutOfStock =
                product.stock === "out of stock";

              return (
                <div
                  key={product._id}
                  className={`product-card ${
                    isOutOfStock ? "out-of-stock" : ""
                  }`}
                  onClick={() =>
                    navigate(`/product/${product._id}`)
                  }
                >
                  {/* IMAGE */}
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                  />

                  {/* NAME */}
                  <h3>{product.name}</h3>

                  {/* PRICE */}
                  <p className="price">{product.price} RON</p>

                  {/* BARCODE */}
                  {product.barcode && (
                    <Barcode value={product.barcode} />
                  )}

                  {/* ✅ STOCK STATUS (UNDER BARCODE) */}
                  <div
                    className={`stock-status ${
                      isOutOfStock ? "out" : "in"
                    }`}
                  >
                    {isOutOfStock
                      ? "Out of stock"
                      : "In stock"}
                  </div>

                  {/* ADD TO CART */}
                  <button
                    className={`add-to-cart-btn ${
                      addedItems.includes(product._id)
                        ? "added"
                        : ""
                    } ${isOutOfStock ? "disabled" : ""}`}
                    onClick={(e) =>
                      handleAddToCart(e, product)
                    }
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
          <div className="pagination">
            <button
              onClick={() =>
                handlePageChange(currentPage - 1)
              }
              disabled={currentPage === 1}
            >
              &laquo; Previous
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={
                  currentPage === index + 1
                    ? "active"
                    : ""
                }
                onClick={() =>
                  handlePageChange(index + 1)
                }
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() =>
                handlePageChange(currentPage + 1)
              }
              disabled={currentPage === totalPages}
            >
              Next &raquo;
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default AllProductsPage;
