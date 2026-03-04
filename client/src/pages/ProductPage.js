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

/* ================================
   SMALL HELPERS
================================ */
const dash = "—";

function formatMoney(amount, currency = "EUR") {
  if (amount === undefined || amount === null || amount === "") return dash;

  // Keep your existing display style, but safe-format if possible
  const n = Number(amount);
  if (Number.isFinite(n)) {
    // Use comma for RO style if desired; keep simple to avoid breaking
    return `${n} ${currency}`;
  }
  return `${amount} ${currency}`;
}

function renderOperator(op) {
  if (!op || typeof op !== "object") return null;

  const name = op.name?.trim();
  const addressParts = [
    op.address,
    op.city,
    op.postalCode,
    op.country,
  ]
    .map((x) => (x ? String(x).trim() : ""))
    .filter(Boolean);

  const address = addressParts.length ? addressParts.join(", ") : "";
  const phone = op.phone?.trim();
  const email = op.email?.trim();
  const website = op.website?.trim();

  const hasAny = name || address || phone || email || website;
  if (!hasAny) return null;

  return (
    <div className="legal-operator">
      {name && <div className="char-row"><span>Denumire</span><strong>{name}</strong></div>}
      {address && <div className="char-row"><span>Adresă</span><strong>{address}</strong></div>}
      {phone && <div className="char-row"><span>Telefon</span><strong>{phone}</strong></div>}
      {email && <div className="char-row"><span>Email</span><strong>{email}</strong></div>}
      {website && <div className="char-row"><span>Website</span><strong>{website}</strong></div>}
    </div>
  );
}

function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart(); // keep as-is (even if unused here)

  const [product, setProduct] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("description");

  // ✅ Use deployed backend on Render, localhost in development
  const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

  /* ================================
     FETCH PRODUCT
  ================================ */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API}/api/products/${id}`);
        setProduct(res.data);
        setActiveTab("description");
      } catch (err) {
        console.error("Fetch product error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, API]);

  /* ================================
     FETCH RECOMMENDED PRODUCTS
  ================================ */
  useEffect(() => {
    if (!product?.category) return;

    const fetchRecommended = async () => {
      try {
        const res = await axios.get(`${API}/api/products`);

        const sameCategoryProducts = res.data
          .filter((p) => p.category === product.category && p._id !== product._id)
          .slice(0, 4);

        setRecommended(sameCategoryProducts);
      } catch (err) {
        console.error("Error fetching recommended:", err);
      }
    };

    fetchRecommended();
  }, [product, API]);

  // ✅ Safe fallbacks so hooks can run even when product is null
  const safeProduct = product || {};

  const productImageUrl = safeProduct.image
    ? `${API}/images/produse/${safeProduct.image}`
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

  const originCountry = safeProduct.originCountry || dash;
  const netWeight = safeProduct.netWeight || dash;

  // NEW: additional legal/label fields (all optional)
  const brand = safeProduct.brand || dash;
  const legalName = safeProduct.legalName || dash;
  const storageConditions = safeProduct.storageConditions || dash;
  const instructionsForUse = safeProduct.instructionsForUse || dash;
  const placeOfProvenance = safeProduct.placeOfProvenance || dash;

  const alcoholByVolume =
    safeProduct.alcoholByVolume === null || safeProduct.alcoholByVolume === undefined
      ? dash
      : `${safeProduct.alcoholByVolume}%`;

  const durabilityDateText = safeProduct.durabilityDateText || dash;
  const lotNumber = safeProduct.lotNumber || dash;

  const currency = safeProduct.currency || "EUR";
  const unitPrice = safeProduct.unitPrice || dash;

  const vatRate =
    safeProduct.vatRate === null || safeProduct.vatRate === undefined
      ? dash
      : `${safeProduct.vatRate}%`;

  const priceIncludesVAT =
    safeProduct.priceIncludesVAT === undefined || safeProduct.priceIncludesVAT === null
      ? dash
      : safeProduct.priceIncludesVAT
      ? "Da"
      : "Nu";

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

      const rows = lines
        .map((line) => {
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

  // Decide if we show the "Etichetă & Legal" tab at all (only if there is something real)
  const hasLegalInfo =
    (safeProduct.brand && safeProduct.brand.trim()) ||
    (safeProduct.legalName && safeProduct.legalName.trim()) ||
    (safeProduct.storageConditions && safeProduct.storageConditions.trim()) ||
    (safeProduct.instructionsForUse && safeProduct.instructionsForUse.trim()) ||
    (safeProduct.placeOfProvenance && safeProduct.placeOfProvenance.trim()) ||
    safeProduct.alcoholByVolume !== null && safeProduct.alcoholByVolume !== undefined ||
    (safeProduct.durabilityDateText && safeProduct.durabilityDateText.trim()) ||
    (safeProduct.lotNumber && safeProduct.lotNumber.trim()) ||
    (safeProduct.unitPrice && safeProduct.unitPrice.trim()) ||
    safeProduct.vatRate !== null && safeProduct.vatRate !== undefined ||
    safeProduct.priceIncludesVAT !== undefined ||
    (safeProduct.foodBusinessOperator && Object.keys(safeProduct.foodBusinessOperator || {}).length > 0) ||
    (safeProduct.importer && Object.keys(safeProduct.importer || {}).length > 0) ||
    (safeProduct.distributor && Object.keys(safeProduct.distributor || {}).length > 0);

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
            <span className="price">
              {product.price} €
            </span>
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

            {hasLegalInfo && (
              <button
                type="button"
                className={activeTab === "legal" ? "tab active" : "tab"}
                onClick={() => setActiveTab("legal")}
              >
                Etichetă &amp; Legal
              </button>
            )}
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

                {/* Optional quick extras if you like */}
                {safeProduct.unitsPerBox && (
                  <div className="char-row">
                    <span>Unități / cutie</span>
                    <strong>{safeProduct.unitsPerBox}</strong>
                  </div>
                )}
                {safeProduct.boxPerPalet && (
                  <div className="char-row">
                    <span>Cutii / palet</span>
                    <strong>{safeProduct.boxPerPalet}</strong>
                  </div>
                )}
              </div>
            )}

            {activeTab === "legal" && (
              <div className="characteristics">
                <div className="char-row">
                  <span>Brand</span>
                  <strong>{brand}</strong>
                </div>

                <div className="char-row">
                  <span>Denumire legală</span>
                  <strong>{legalName}</strong>
                </div>

                <div className="char-row">
                  <span>Loc de proveniență</span>
                  <strong>{placeOfProvenance}</strong>
                </div>

                <div className="char-row">
                  <span>Condiții de depozitare</span>
                  <strong>{storageConditions}</strong>
                </div>

                <div className="char-row">
                  <span>Instrucțiuni de utilizare</span>
                  <strong>{instructionsForUse}</strong>
                </div>

                <div className="char-row">
                  <span>Alcool</span>
                  <strong>{alcoholByVolume}</strong>
                </div>

                <div className="char-row">
                  <span>Lot</span>
                  <strong>{lotNumber}</strong>
                </div>

                <div className="char-row">
                  <span>Mențiune durabilitate</span>
                  <strong>{durabilityDateText}</strong>
                </div>

                <div className="char-row">
                  <span>Preț / unitate</span>
                  <strong>{unitPrice}</strong>
                </div>

                <div className="char-row">
                  <span>TVA (%)</span>
                  <strong>{vatRate}</strong>
                </div>

                <div className="char-row">
                  <span>Preț include TVA</span>
                  <strong>{priceIncludesVAT}</strong>
                </div>

                <div className="char-row">
                  <span>Monedă</span>
                  <strong>{currency}</strong>
                </div>

                {/* Operators */}
                {renderOperator(safeProduct.foodBusinessOperator) && (
                  <>
                    <h4 className="tab-title" style={{ marginTop: 18 }}>
                      Operator economic (responsabil)
                    </h4>
                    {renderOperator(safeProduct.foodBusinessOperator)}
                  </>
                )}

                {renderOperator(safeProduct.importer) && (
                  <>
                    <h4 className="tab-title" style={{ marginTop: 18 }}>
                      Importator
                    </h4>
                    {renderOperator(safeProduct.importer)}
                  </>
                )}

                {renderOperator(safeProduct.distributor) && (
                  <>
                    <h4 className="tab-title" style={{ marginTop: 18 }}>
                      Distribuitor
                    </h4>
                    {renderOperator(safeProduct.distributor)}
                  </>
                )}
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
                ? `${API}/images/produse/${item.image}`
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