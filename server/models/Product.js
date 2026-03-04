// models/product.js
import mongoose from "mongoose";

/**
 * Nutrition values (per 100g).
 * _id: false prevents Mongo from creating an _id for this nested object.
 */
const nutritionPer100gSchema = new mongoose.Schema(
  {
    energyKj: { type: Number, default: null },
    energyKcal: { type: Number, default: null },

    fat: { type: Number, default: null },
    saturatedFat: { type: Number, default: null },

    carbs: { type: Number, default: null },
    sugars: { type: Number, default: null },

    fiber: { type: Number, default: null },
    protein: { type: Number, default: null },

    salt: { type: Number, default: null },
  },
  { _id: false }
);

/**
 * Food business operator (responsible operator under whose name the food is marketed).
 * This is part of mandatory consumer info for prepacked foods (EU 1169/2011).
 */
const foodBusinessOperatorSchema = new mongoose.Schema(
  {
    name: { type: String, default: "", trim: true }, // company name
    address: { type: String, default: "", trim: true }, // full postal address (street, number, etc.)
    city: { type: String, default: "", trim: true },
    postalCode: { type: String, default: "", trim: true },
    country: { type: String, default: "", trim: true },
    phone: { type: String, default: "", trim: true },
    email: { type: String, default: "", trim: true },
    website: { type: String, default: "", trim: true },
  },
  { _id: false }
);

/**
 * Ingredient with optional QUID percentage (quantity of certain ingredients/categories).
 * Useful when you must declare percentages for emphasized ingredients.
 */
const ingredientItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    percent: { type: Number, default: null }, // e.g., 60 for "Peaches 60%"
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    // ---------------- BASIC INFO ----------------
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    // 💶 Price is stored as NUMBER (EUR by convention)
    price: {
      type: Number,
      required: true,
    },

    // ---------------- STOCK ----------------
    stock: {
      type: String,
      enum: ["in stock", "out of stock"],
      default: "in stock",
    },

    // ---------------- LOGISTICS (OPTIONAL) ----------------
    unitsPerBox: {
      type: String,
      default: "",
    },

    boxPerPalet: {
      type: String,
      default: "",
    },

    // ---------------- IDENTIFICATION (OPTIONAL) ----------------
    barcode: {
      type: String,
      default: "",
    },

    // ---------------- IMAGE (OPTIONAL) ----------------
    image: {
      type: String,
      default: "",
    },

    // ---------------- CATEGORY ----------------
    category: {
      type: String,
      required: true,
      enum: [
        // ===== HORECA =====
        "legume-conservate-horeca",
        "sosuri-horeca",
        "dulceturi",

        // ===== SUPERMARKET =====
        "legume-conservate",
        "produse-din-branza",
        "dulciuri-si-snacks-uri",
        "cafea-si-bauturi",
        "sosuri",
        "masline",
        "alimente-cu-amidon",
        "placinta",
      ],
    },

    // =========================================================
    // ✅ EXISTING OPTIONAL FIELDS (you already use these)
    // =========================================================

    // Ingredients as one text field (easy to paste from labels)
    ingredientsText: {
      type: String,
      default: "",
      trim: true,
    },

    // Allergens list (optional)
    allergens: {
      type: [String],
      default: [],
    },

    // Nutrition per 100g (optional object)
    nutritionPer100g: {
      type: nutritionPer100gSchema,
      default: undefined, // keeps it absent unless you send it
    },

    originCountry: {
      type: String,
      default: "",
      trim: true,
    },

    netWeight: {
      type: String,
      default: "",
      trim: true,
    },

    // =========================================================
    // ✅ NEW FIELDS (to cover mandatory info to show online)
    // =========================================================

    /**
     * Brand / commercial brand (not always mandatory, but commonly shown online).
     */
    brand: {
      type: String,
      default: "",
      trim: true,
    },

    /**
     * Legal sales name (if different from "name").
     * Example: "Gem de piersici extra" etc.
     */
    legalName: {
      type: String,
      default: "",
      trim: true,
    },

    /**
     * Structured ingredient list (optional) + QUID percentages.
     * You can still keep ingredientsText as your main field.
     */
    ingredients: {
      type: [ingredientItemSchema],
      default: [],
    },

    /**
     * Special storage conditions / conditions of use (mandatory when applicable).
     * Example: "A se păstra la loc uscat și răcoros. După deschidere, la frigider..."
     */
    storageConditions: {
      type: String,
      default: "",
      trim: true,
    },

    /**
     * Instructions for use (mandatory when needed).
     * Example: "A se consuma ca atare" / "Se încălzește înainte de consum" etc.
     */
    instructionsForUse: {
      type: String,
      default: "",
      trim: true,
    },

    /**
     * Responsible Food Business Operator (name + address).
     * Mandatory consumer info (EU 1169/2011).
     */
    foodBusinessOperator: {
      type: foodBusinessOperatorSchema,
      default: undefined,
    },

    /**
     * If you import products, storing importer/distributor helps in RO practice.
     * Not always mandatory if operator already covers it, but useful.
     */
    importer: {
      type: foodBusinessOperatorSchema,
      default: undefined,
    },

    distributor: {
      type: foodBusinessOperatorSchema,
      default: undefined,
    },

    /**
     * Place of provenance (when relevant / when required).
     * Example: "UE / Non-UE", region, specific place.
     */
    placeOfProvenance: {
      type: String,
      default: "",
      trim: true,
    },

    /**
     * Alcohol by volume (mandatory for beverages >1.2% alc, if you sell any).
     */
    alcoholByVolume: {
      type: Number,
      default: null, // e.g., 5.0 for 5%
      min: 0,
    },

    /**
     * Dates:
     * IMPORTANT: for distance selling, the "best before / use by" date is the main exception:
     * it does NOT have to be shown online before purchase, but is usually on the label.
     * Still, many shops store it for internal ops.
     */
    durabilityDateText: {
      // e.g. "A se consuma de preferință înainte de: 12.08.2026"
      type: String,
      default: "",
      trim: true,
    },

    /**
     * Lot / batch (commonly required on packaging for traceability).
     * Not typically required to show online, but useful for ops/recalls.
     */
    lotNumber: {
      type: String,
      default: "",
      trim: true,
    },

    /**
     * Pricing compliance helpers (useful online):
     * - unitPrice: price per kg/L when applicable (RO/EU consumer practice)
     * - vatRate: if you need to show VAT breakdown
     * Keep your existing "price" as-is.
     */
    currency: {
      type: String,
      default: "EUR",
      trim: true,
    },

    priceIncludesVAT: {
      type: Boolean,
      default: true,
    },

    vatRate: {
      type: Number,
      default: null, // e.g. 9 or 19
      min: 0,
    },

    unitPrice: {
      // e.g. "11.40 EUR/kg" or computed value stored as number
      type: String,
      default: "",
      trim: true,
    },

    /**
     * Pack/serving helpers (not mandatory, but often helpful):
     */
    servingsPerPack: {
      type: Number,
      default: null,
      min: 0,
    },

    portionSize: {
      // e.g. "30 g"
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product;