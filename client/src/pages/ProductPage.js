import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import JsBarcode from "jsbarcode";
import "../styles/ProductPage.scss";
import AddToCartButton from "../components/AddToCartButton";

/* ================================
   BARCODE COMPONENT
================================ */
function Barcode({ value }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (svgRef.current && value) {
      JsBarcode(svgRef.current, String(value), {
        format: "CODE128",
        width: 2,
        height: 60,
        displayValue: false,
      });
    }
  }, [value]);

  return (
    <div className="barcode-wrapper">
      <svg ref={svgRef}></svg>
      <p className="barcode-number">{value}</p>
    </div>
  );
}

function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================================
     FETCH PRODUCT
  ================================ */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/products/${id}`
        );
        setProduct(res.data);
      } catch (err) {
        console.error("Fetch product error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  /* ================================
     FETCH RECOMMENDED PRODUCTS
  ================================ */
  useEffect(() => {
    if (!product?.category) return;

    const fetchRecommended = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");

        const sameCategoryProducts = res.data
          .filter(
            (p) => p.category === product.category && p._id !== product._id
          )
          .slice(0, 4);

        setRecommended(sameCategoryProducts);
      } catch (err) {
        console.error("Error fetching recommended:", err);
      }
    };

    fetchRecommended();
  }, [product]);

  if (loading) return <p className="loading">Loading...</p>;
  if (!product) return <p>Product not found.</p>;

  /* ================================
     MAIN PRODUCT IMAGE
  ================================ */
  const productImageUrl = product.image
    ? `http://localhost:5000/images/produse/${product.image}`
    : `${process.env.PUBLIC_URL}/images/no-image.png`;

  return (
    <div className="product-page">
      <div className="product-page__container">
        <div className="product-page__image">
          <img src={productImageUrl} alt={product.name} />
        </div>

        <div className="product-page__info">
          <h1>{product.name}</h1>

          {product.description && <p>{product.description}</p>}

          <div className="product-page__price-stock">
            <span className="price">{product.price} RON</span>
            <span
              className={`stock ${
                product.stock === "in stock" ? "in" : "out"
              }`}
            >
              {product.stock === "in stock" ? "In stock" : "Out of stock"}
            </span>
          </div>

          {product.barcode && <Barcode value={product.barcode} />}

          <AddToCartButton product={product} variant="single" />
        </div>
      </div>

      {/* ================================
          RECOMMENDED PRODUCTS
      ================================ */}
      {recommended.length > 0 && (
        <div className="recommended-section">
          <h2>Other Recommended Products</h2>

          <div className="recommended-grid">
            {recommended.map((item) => {
              const recommendedImageUrl = item.image
                ? `http://localhost:5000/images/produse/${item.image}`
                : `${process.env.PUBLIC_URL}/images/no-image.png`;

              return (
                <div
                  key={item._id}
                  className="recommended-card"
                  onClick={() => navigate(`/product/${item._id}`)}
                >
                  <img src={recommendedImageUrl} alt={item.name} />
                  <h3>{item.name}</h3>
                  <p>{item.price} RON</p>
                  <AddToCartButton product={item} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductPage;
