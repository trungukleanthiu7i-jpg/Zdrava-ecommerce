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

      return lines
        .map((line) => {
          const parts = line.split(":");
          if (parts.length < 2) return null;
          const left = parts[0].trim();
          const right = parts.slice(1).join(":").trim();
          if (!left || !right) return null;
          return { label: left, value: right, unit: "" };
        })
        .filter(Boolean);
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

    return [
      { label: "Valoare energetică", value: enEnergyKj || energyKj, unit: "kj" },
      { label: "Valoare energetică", value: enEnergyKcal || energyKcal, unit: "kcal" },
      {
        label: "Grăsimi",
        value: normalizeVal(nutrition["Grăsimi"] || nutrition["Grasimi"] || nutrition.fat),
        unit: "g",
      },
      {
        label: "din care acizi grași saturați",
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
  const handleDownloadPdf = async () => {
    if (!product) return;

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 12;
    const contentWidth = pageWidth - margin * 2;

    let y = 12;

    const normalizeText = (value) => {
      if (value === null || value === undefined) return "";
      return String(value)
        .replace(/ă/g, "a")
        .replace(/â/g, "a")
        .replace(/î/g, "i")
        .replace(/ș/g, "s")
        .replace(/ş/g, "s")
        .replace(/ț/g, "t")
        .replace(/ţ/g, "t")
        .replace(/Ă/g, "A")
        .replace(/Â/g, "A")
        .replace(/Î/g, "I")
        .replace(/Ș/g, "S")
        .replace(/Ş/g, "S")
        .replace(/Ț/g, "T")
        .replace(/Ţ/g, "T");
    };

    const loadImageAsDataUrl = (src) =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/png"));
        };
        img.onerror = reject;
        img.src = src;
      });

    const ensurePageSpace = (needed = 10) => {
      if (y + needed > pageHeight - 15) {
        pdf.addPage();
        y = 15;
      }
    };

    const drawWrappedText = (text, x, width, fontSize = 10, lineHeight = 5) => {
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(fontSize);
      const lines = pdf.splitTextToSize(normalizeText(text || ""), width);
      pdf.text(lines, x, y);
      y += lines.length * lineHeight;
    };

    const drawSectionTitle = (title) => {
      ensurePageSpace(14);

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(13);
      pdf.setTextColor(24, 69, 140);
      pdf.text(normalizeText(title), margin, y);

      y += 4;

      pdf.setDrawColor(24, 69, 140);
      pdf.setLineWidth(0.5);
      pdf.line(margin, y, pageWidth - margin, y);

      y += 6;
      pdf.setTextColor(0, 0, 0);
    };

    const drawLabelValue = (label, value, labelWidth = 46, fontSize = 10) => {
      if (!value || String(value).trim() === "") return;
      ensurePageSpace(8);

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(fontSize);
      pdf.text(normalizeText(label), margin, y);

      pdf.setFont("helvetica", "normal");
      const textX = margin + labelWidth;
      const textWidth = contentWidth - labelWidth;
      const lines = pdf.splitTextToSize(normalizeText(value), textWidth);
      pdf.text(lines, textX, y);

      y += Math.max(6, lines.length * 5);
    };

    try {
      const logoUrl = `${process.env.PUBLIC_URL}/images/Zdrava-logo-color.png`;

      let logoData = null;
      let productData = null;

      try {
        logoData = await loadImageAsDataUrl(logoUrl);
      } catch (e) {
        console.warn("Logo could not be loaded for PDF.");
      }

      try {
        if (productImageUrl) {
          productData = await loadImageAsDataUrl(productImageUrl);
        }
      } catch (e) {
        console.warn("Product image could not be loaded for PDF.");
      }

      /* =========================
         HEADER
      ========================= */
      pdf.setFillColor(242, 247, 243);
      pdf.rect(0, 0, pageWidth, 44, "F");

      if (logoData) {
        pdf.addImage(logoData, "PNG", margin, 8, 46, 20);
      } else {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(20);
        pdf.setTextColor(31, 122, 61);
        pdf.text("ZDRAVA", margin, 20);
      }

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      pdf.text("Fisa produs", margin, 34);

      y = 54;

      /* =========================
         TITLE + PRODUCT BLOCK
      ========================= */
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(18);
      pdf.setTextColor(24, 69, 140);

      const titleLines = pdf.splitTextToSize(normalizeText(product.name || "Produs"), 118);
      pdf.text(titleLines, margin, y);
      const titleHeight = titleLines.length * 7;

      pdf.setTextColor(0, 0, 0);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);

      let metaY = y + titleHeight + 4;

      pdf.text(
        `Pret: ${normalizeText(product.price ? `${product.price} EUR` : dash)}`,
        margin,
        metaY
      );
      metaY += 6;

      pdf.text(
        `Stoc: ${normalizeText(
          product.stock === "in stock"
            ? "In stock"
            : product.stock === "out of stock"
            ? "Out of stock"
            : product.stock || dash
        )}`,
        margin,
        metaY
      );
      metaY += 6;

      if (product.barcode) {
        pdf.text(`Cod de bare: ${normalizeText(product.barcode)}`, margin, metaY);
        metaY += 6;
      }

      if (product.category) {
        pdf.text(`Categorie: ${normalizeText(product.category)}`, margin, metaY);
        metaY += 6;
      }

      if (productData) {
        pdf.setDrawColor(220, 220, 220);
        pdf.setFillColor(255, 255, 255);
        pdf.roundedRect(146, 48, 48, 48, 3, 3, "FD");
        pdf.addImage(productData, "PNG", 151, 53, 38, 38);
      }

      y = Math.max(metaY + 7, 104);

      /* =========================
         DESCRIPTION
      ========================= */
      drawSectionTitle("Descriere");
      drawWrappedText(
        product.description || "Nu exista descriere pentru acest produs.",
        margin,
        contentWidth,
        10,
        5
      );
      y += 4;

      /* =========================
         INGREDIENTE
      ========================= */
      drawSectionTitle("Ingrediente");
      drawWrappedText(ingredientsText, margin, contentWidth, 10, 5);
      y += 4;

      drawSectionTitle("Alergeni");
      drawWrappedText(allergensText, margin, contentWidth, 10, 5);
      y += 4;

      /* =========================
         NUTRITION TABLE
      ========================= */
      if (hasNutrition) {
        drawSectionTitle("Informatii nutritionale / 100 g / 100 ml");

        const tableX = margin;
        const tableY = y;
        const col1 = 110;
        const col2 = 68;
        const rowH = 8;

        pdf.setFillColor(24, 69, 140);
        pdf.rect(tableX, tableY, col1 + col2, rowH, "F");

        pdf.setTextColor(255, 255, 255);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10);
        pdf.text("Informatii nutritionale", tableX + 2, tableY + 5.5);
        pdf.text("Valoare", tableX + col1 + 2, tableY + 5.5);

        y = tableY + rowH;
        pdf.setTextColor(0, 0, 0);

        nutritionDisplayRows.forEach((row, index) => {
          ensurePageSpace(rowH + 2);

          if (index % 2 === 0) {
            pdf.setFillColor(248, 248, 248);
            pdf.rect(tableX, y, col1 + col2, rowH, "F");
          }

          pdf.setDrawColor(185, 185, 185);
          pdf.rect(tableX, y, col1, rowH);
          pdf.rect(tableX + col1, y, col2, rowH);

          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(9.5);
          pdf.text(normalizeText(row.label), tableX + 2, y + 5.4);
          pdf.text(
            normalizeText(`${row.value} ${row.unit}`.trim()),
            tableX + col1 + 2,
            y + 5.4
          );

          y += rowH;
        });

        y += 6;
      }

      /* =========================
         CHARACTERISTICS
      ========================= */
      drawSectionTitle("Caracteristici");
      drawLabelValue("Tara de origine", originCountry);
      drawLabelValue("Greutate neta", netWeight);
      y += 2;

      /* =========================
         LABEL
      ========================= */
      if (hasLabelInfo) {
        drawSectionTitle("Eticheta");

        if (storageConditions?.trim()) {
          drawLabelValue("Conditii de depozitare", storageConditions);
        }

        if (instructionsForUse?.trim()) {
          drawLabelValue("Instructiuni de utilizare", instructionsForUse);
        }

        if (caffeineMgPer100ml !== null) {
          drawLabelValue("Cafeina", `${caffeineMgPer100ml} mg / 100 ml`);
        }

        if (highCaffeineWarningText?.trim()) {
          drawLabelValue("Avertizare", highCaffeineWarningText);
        }

        if (foodBusinessOperator) {
          const opName = foodBusinessOperator.name || "";
          const opAddress = [
            foodBusinessOperator.address,
            foodBusinessOperator.city,
            foodBusinessOperator.postalCode,
            foodBusinessOperator.country,
          ]
            .filter(Boolean)
            .join(", ");

          if (opName || opAddress) {
            drawSectionTitle("Operator economic responsabil");
            if (opName) drawLabelValue("Denumire", opName);
            if (opAddress) drawLabelValue("Adresa", opAddress);
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
            drawSectionTitle("Importator");
            if (importerName) drawLabelValue("Denumire", importerName);
            if (importerAddress) drawLabelValue("Adresa", importerAddress);
          }
        }
      }

      /* =========================
         FOOTER
      ========================= */
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.setTextColor(120, 120, 120);
      pdf.text(
        "Document generat automat din fisa produsului Zdrava.",
        margin,
        pageHeight - 8
      );

      const safeFileName = (product.name || "produs")
        .replace(/[\\/:*?"<>|]+/g, "")
        .trim();

      pdf.save(`${safeFileName}-fisa-produs.pdf`);
    } catch (err) {
      console.error("PDF generation error:", err);
    }
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
            Descarcă fișa produsului
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
                {storageConditions && storageConditions.trim() && (
                  <div className="char-row">
                    <span>Condiții de depozitare</span>
                    <strong>{storageConditions}</strong>
                  </div>
                )}

                {instructionsForUse && instructionsForUse.trim() && (
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

                    {highCaffeineWarningText && highCaffeineWarningText.trim() && (
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