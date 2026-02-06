import React, { useEffect, useState, useRef, useMemo } from "react";
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

  const [activeTab, setActiveTab] = useState("description");

  /* ================================
     FETCH PRODUCT
  ================================ */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data);
        setActiveTab("description");
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
          .filter((p) => p.category === product.category && p._id !== product._id)
          .slice(0, 4);

        setRecommended(sameCategoryProducts);
      } catch (err) {
        console.error("Error fetching recommended:", err);
      }
    };

    fetchRecommended();
  }, [product]);

  // ✅ Safe fallbacks so hooks can run even when product is null
  const safeProduct = product || {};

  const productImageUrl = safeProduct.image
    ? `http://localhost:5000/images/produse/${safeProduct.image}`
    : `${process.env.PUBLIC_URL}/images/no-image.png`;

  const ingredientsText =
    safeProduct.ingredientsText ||
    "Nu există ingrediente introduse pentru acest produs.";

  const allergensText = Array.isArray(safeProduct.allergens)
    ? safeProduct.allergens.length
      ? safeProduct.allergens.join(", ")
      : "Nu conține alergeni declarați."
    : safeProduct.allergens
      ? String(safeProduct.allergens)
      : "Nu conține alergeni declarați.";

  const originCountry = safeProduct.originCountry || "—";
  const netWeight = safeProduct.netWeight || "—";

  const nutrition = safeProduct.nutritionPer100g;

  // ✅ Build nutrition display rows (supports RO keys object OR EN keys object OR string)
  const nutritionDisplayRows = useMemo(() => {
    const normalizeVal = (v) => {
      if (v === undefined || v === null) return "";
      const s = String(v).trim();
      if (!s) return "";
      return s.replace(/\./g, ",");
    };

    // STRING case (optional)
    if (typeof nutrition === "string") {
      const lines = nutrition
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

      // If it's just free text without ":", show nothing (or you can show raw text)
      const rows = lines
        .map((line, idx) => {
          const parts = line.split(":");
          if (parts.length < 2) return null;
          const left = parts[0].trim();
          const right = parts.slice(1).join(":").trim();
          if (!left || !right) return null;
          return { label: left, value: right, unit: "" };
        })
        .filter(Boolean);

      return rows;
    }

    // OBJECT case
    const isObj = nutrition && typeof nutrition === "object" && !Array.isArray(nutrition);
    if (!isObj) return [];

    // Your RO energy is in one field like: "1963 kj/467 kcal"
    const roEnergy = nutrition["Valoare energetică"] || nutrition["Valoare energetica"];
    let energyKj = "";
    let energyKcal = "";
    if (roEnergy) {
      const s = String(roEnergy);
      const kjMatch = s.match(/([0-9.,]+)\s*kj/i);
      const kcalMatch = s.match(/([0-9.,]+)\s*kcal/i);
      energyKj = kjMatch ? normalizeVal(kjMatch[1]) : "";
      energyKcal = kcalMatch ? normalizeVal(kcalMatch[1]) : "";
    }

    // Also support EN keys if you later use them
    const enEnergyKj = nutrition.energyKj != null ? normalizeVal(nutrition.energyKj) : "";
    const enEnergyKcal = nutrition.energyKcal != null ? normalizeVal(nutrition.energyKcal) : "";

    const rows = [
      { label: "Valoare energetică", value: enEnergyKj || energyKj, unit: "kj" },
      { label: "Valoare energetică", value: enEnergyKcal || energyKcal, unit: "kcal" },
      {
        label: "Grăsimi",
        value: normalizeVal(nutrition["Grăsimi"] || nutrition["Grasimi"] || nutrition.fat),
        unit: "g",
      },
      {
        label: "din care acizi graşi saturaţi",
        value: normalizeVal(
          nutrition["din care acizi graşi saturaţi"] ||
          nutrition["din care acizi grasi saturati"] ||
          nutrition.saturatedFat
        ),
        unit: "g",
      },
      {
        label: "Glucide",
        value: normalizeVal(nutrition["Glucide"] || nutrition.carbs),
        unit: "g",
      },
      {
        label: "din care zaharuri",
        value: normalizeVal(nutrition["din care zaharuri"] || nutrition.sugars),
        unit: "g",
      },
      {
        label: "Fibre",
        value: normalizeVal(nutrition["Fibre"] || nutrition.fiber),
        unit: "g",
      },
      {
        label: "Proteine",
        value: normalizeVal(nutrition["Proteine"] || nutrition.protein),
        unit: "g",
      },
      {
        label: "Sare",
        value: normalizeVal(nutrition["Sare"] || nutrition.salt),
        unit: "g",
      },
    ]
      .map((r) => {
        if (!r.value) return r;
        // If value already includes unit like "18 g", strip it to avoid "g g"
        const cleaned = String(r.value).replace(/\s*(kj|kcal|g)\s*$/i, "").trim();
        return { ...r, value: cleaned };
      })
      .filter((r) => r.value);

    return rows;
  }, [nutrition]);

  const hasNutrition = nutritionDisplayRows.length > 0;

  // ✅ Now it's safe to early return (hooks already ran)
  if (loading) return <p className="loading">Loading...</p>;
  if (!product) return <p>Product not found.</p>;

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
            <span className="price">{product.price} €</span>
            <span className={`stock ${product.stock === "in stock" ? "in" : "out"}`}>
              {product.stock === "in stock" ? "In stock" : "Out of stock"}
            </span>
          </div>

          {product.barcode && <Barcode value={product.barcode} />}

          <AddToCartButton product={product} variant="single" />

          {/* TABS */}
          <div className="product-tabs">
            <button
              type="button"
              className={activeTab === "description" ? "tab active" : "tab"}
              onClick={() => setActiveTab("description")}
            >
              Descriere
            </button>

            <button
              type="button"
              className={activeTab === "ingredients" ? "tab active" : "tab"}
              onClick={() => setActiveTab("ingredients")}
            >
              Ingrediente &amp; Alergeni
            </button>

            <button
              type="button"
              className={activeTab === "characteristics" ? "tab active" : "tab"}
              onClick={() => setActiveTab("characteristics")}
            >
              Caracteristici
            </button>
          </div>

          <div className="tab-content">
            {activeTab === "description" && (
              <p className="tab-text">
                {product.description || "Nu există descriere pentru acest produs."}
              </p>
            )}

            {activeTab === "ingredients" && (
              <>
                <h4 className="tab-title">Ingrediente</h4>
                <p className="tab-text">{ingredientsText}</p>

                <h4 className="tab-title">Alergeni</h4>
                <p className="tab-text">{allergensText}</p>

                <h4 className="tab-title">
                  Informații nutriționale <span className="nutrition-note">(per 100 g)</span>
                </h4>


                {hasNutrition ? (
                  <div className="nutrition-wrap">
                    <table className="nutrition-table">

                      <tbody>
                        {nutritionDisplayRows.map((r, idx) => (
                          <tr key={`${r.label}-${idx}`}>
                            <td>{r.label}</td>
                            <td style={{ textAlign: "right" }}>
                              {r.value} {r.unit}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="tab-muted">Nu există valori nutriționale introduse.</p>
                )}
              </>
            )}

            {activeTab === "characteristics" && (
              <div className="characteristics">
                <div className="char-row">
                  <span>Țara de origine</span>
                  <strong>{originCountry}</strong>
                </div>
                <div className="char-row">
                  <span>Greutate netă</span>
                  <strong>{netWeight}</strong>
                </div>
              </div>
            )}
          </div>
          {/* END TABS */}
        </div>
      </div>

      {/* RECOMMENDED PRODUCTS */}
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
                  <p>{item.price} €</p>
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
