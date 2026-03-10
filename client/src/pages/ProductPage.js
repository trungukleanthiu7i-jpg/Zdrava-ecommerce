import React, { useEffect, useState, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { jsPDF } from "jspdf";
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

function renderOperatorMinimal(op) {
  if (!op || typeof op !== "object") return null;

  const name = op.name ? String(op.name).trim() : "";
  const addressParts = [op.address, op.city, op.postalCode, op.country]
    .map((x) => (x ? String(x).trim() : ""))
    .filter(Boolean);
  const address = addressParts.length ? addressParts.join(", ") : "";

  if (!name && !address) return null;

  return (
    <div className="legal-operator">
      {name && (
        <div className="char-row">
          <span>Denumire</span>
          <strong>{name}</strong>
        </div>
      )}
      {address && (
        <div className="char-row">
          <span>Adresă</span>
          <strong>{address}</strong>
        </div>
      )}
    </div>
  );
}

function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart(); // keep as-is

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

  // ✅ NEW (mandatory/conditional) fields you added in the minimal schema
  const storageConditions = safeProduct.storageConditions || "";
  const instructionsForUse = safeProduct.instructionsForUse || "";
  const caffeineMgPer100ml =
    safeProduct.caffeineMgPer100ml === null ||
    safeProduct.caffeineMgPer100ml === undefined
      ? null
      : safeProduct.caffeineMgPer100ml;

  const highCaffeineWarningText = safeProduct.highCaffeineWarningText || "";

  const foodBusinessOperator = safeProduct.foodBusinessOperator;
  const importer = safeProduct.importer;

  const nutrition = safeProduct.nutritionPer100g;

  // ✅ Build nutrition display rows
  const nutritionDisplayRows = useMemo(() => {
    const normalizeVal = (v) => {
      if (v === undefined || v === null) return "";
      const s = String(v).trim();
      if (!s) return "";
      return s.replace(/\./g, ",");
    };

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

  const hasLabelInfo =
    (storageConditions && storageConditions.trim()) ||
    (instructionsForUse && instructionsForUse.trim()) ||
    (foodBusinessOperator && Object.keys(foodBusinessOperator || {}).length > 0) ||
    (importer && Object.keys(importer || {}).length > 0) ||
    caffeineMgPer100ml !== null ||
    (highCaffeineWarningText && highCaffeineWarningText.trim());

  /* ================================
     PDF DOWNLOAD
  ================================ */
  const handleDownloadPdf = () => {
    if (!product) return;

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const maxWidth = 180;
    const left = 15;
    let y = 18;

    const addWrappedText = (text, x, yPos, width = maxWidth, lineHeight = 6) => {
      const lines = pdf.splitTextToSize(String(text || ""), width);
      pdf.text(lines, x, yPos);
      return yPos + lines.length * lineHeight;
    };

    const addSectionTitle = (title) => {
      if (y > 270) {
        pdf.addPage();
        y = 18;
      }
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.text(title, left, y);
      y += 8;
    };

    const addLine = (label, value) => {
      if (!value || String(value).trim() === "") return;
      if (y > 270) {
        pdf.addPage();
        y = 18;
      }
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.text(`${label}:`, left, y);

      pdf.setFont("helvetica", "normal");
      y = addWrappedText(String(value), left + 35, y, 145);
      y += 2;
    };

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text(product.name || "Produs", left, y);
    y += 10;

    pdf.setDrawColor(200, 200, 200);
    pdf.line(left, y, pageWidth - 15, y);
    y += 8;

    addLine("Preț", product.price ? `${product.price} €` : dash);
    addLine(
      "Stoc",
      product.stock === "in stock"
        ? "In stock"
        : product.stock === "out of stock"
        ? "Out of stock"
        : product.stock || dash
    );
    addLine("Cod de bare", product.barcode || dash);
    addLine("Categorie", product.category || dash);

    addSectionTitle("Descriere");
    y = addWrappedText(
      product.description || "Nu există descriere pentru acest produs.",
      left,
      y
    );
    y += 6;

    addSectionTitle("Ingrediente și alergeni");
    addLine("Ingrediente", ingredientsText);
    addLine("Alergeni", allergensText);

    if (hasNutrition) {
      addSectionTitle("Informații nutriționale (per 100 g / 100 ml)");
      nutritionDisplayRows.forEach((row) => {
        addLine(row.label, `${row.value} ${row.unit}`.trim());
      });
    }

    addSectionTitle("Caracteristici");
    addLine("Țara de origine", originCountry);
    addLine("Greutate netă", netWeight);

    if (hasLabelInfo) {
      addSectionTitle("Etichetă");

      if (storageConditions && storageConditions.trim()) {
        addLine("Condiții de depozitare", storageConditions);
      }

      if (instructionsForUse && instructionsForUse.trim()) {
        addLine("Instrucțiuni de utilizare", instructionsForUse);
      }

      if (caffeineMgPer100ml !== null) {
        addLine("Cafeină", `${caffeineMgPer100ml} mg / 100 ml`);
      }

      if (highCaffeineWarningText && highCaffeineWarningText.trim()) {
        addLine("Avertizare", highCaffeineWarningText);
      }

      if (foodBusinessOperator) {
        const operatorName = foodBusinessOperator.name || "";
        const operatorAddress = [
          foodBusinessOperator.address,
          foodBusinessOperator.city,
          foodBusinessOperator.postalCode,
          foodBusinessOperator.country,
        ]
          .filter(Boolean)
          .join(", ");

        if (operatorName || operatorAddress) {
          addSectionTitle("Operator economic responsabil");
          if (operatorName) addLine("Denumire", operatorName);
          if (operatorAddress) addLine("Adresă", operatorAddress);
        }
      }

      if (importer) {
        const importerName = importer.name || "";
        const importerAddress = [
          importer.address,
          importer.city,
          importer.postalCode,
          importer.country,
        ]
          .filter(Boolean)
          .join(", ");

        if (importerName || importerAddress) {
          addSectionTitle("Importator");
          if (importerName) addLine("Denumire", importerName);
          if (importerAddress) addLine("Adresă", importerAddress);
        }
      }
    }

    const safeFileName = (product.name || "produs")
      .replace(/[\\/:*?"<>|]+/g, "")
      .trim();

    pdf.save(`${safeFileName}-fisa-produs.pdf`);
  };

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

          <button
            type="button"
            className="download-pdf-btn"
            onClick={handleDownloadPdf}
          >
            Descarcă fișa produsului PDF
          </button>

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

            {hasLabelInfo && (
              <button
                type="button"
                className={activeTab === "label" ? "tab active" : "tab"}
                onClick={() => setActiveTab("label")}
              >
                Etichetă
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
                  Informații nutriționale{" "}
                  <span className="nutrition-note">(per 100 g / 100 ml)</span>
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

            {activeTab === "label" && (
              <div className="characteristics">
                {(storageConditions && storageConditions.trim()) && (
                  <div className="char-row">
                    <span>Condiții de depozitare</span>
                    <strong>{storageConditions}</strong>
                  </div>
                )}

                {(instructionsForUse && instructionsForUse.trim()) && (
                  <div className="char-row">
                    <span>Instrucțiuni de utilizare</span>
                    <strong>{instructionsForUse}</strong>
                  </div>
                )}

                {(caffeineMgPer100ml !== null ||
                  (highCaffeineWarningText && highCaffeineWarningText.trim())) && (
                  <>
                    <h4 className="tab-title" style={{ marginTop: 18 }}>
                      Avertizare cafeină
                    </h4>

                    {caffeineMgPer100ml !== null && (
                      <div className="char-row">
                        <span>Cafeină</span>
                        <strong>{caffeineMgPer100ml} mg / 100 ml</strong>
                      </div>
                    )}

                    {(highCaffeineWarningText && highCaffeineWarningText.trim()) && (
                      <p className="tab-text">{highCaffeineWarningText}</p>
                    )}
                  </>
                )}

                {renderOperatorMinimal(foodBusinessOperator) && (
                  <>
                    <h4 className="tab-title" style={{ marginTop: 18 }}>
                      Operator economic responsabil
                    </h4>
                    {renderOperatorMinimal(foodBusinessOperator)}
                  </>
                )}

                {renderOperatorMinimal(importer) && (
                  <>
                    <h4 className="tab-title" style={{ marginTop: 18 }}>
                      Importator (dacă este cazul)
                    </h4>
                    {renderOperatorMinimal(importer)}
                  </>
                )}

                {!hasLabelInfo && (
                  <p className="tab-muted">
                    Nu există informații suplimentare de etichetă introduse.
                  </p>
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