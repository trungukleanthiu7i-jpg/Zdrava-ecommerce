// models/product.js
import mongoose from "mongoose";

/**
 * Optional sub-schema for nutrition values (per 100g / 100ml).
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
 * Responsible food business operator (mandatory info for prepacked foods).
 * (name + address of the operator under whose name the food is marketed)
 */
const foodBusinessOperatorSchema = new mongoose.Schema(
  {
    name: { type: String, default: "", trim: true },
    address: { type: String, default: "", trim: true },
    city: { type: String, default: "", trim: true },
    postalCode: { type: String, default: "", trim: true },
    country: { type: String, default: "", trim: true },
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
      type: String, // kept as string to match existing DB
      default: "",
    },

    boxPerPalet: {
      type: String, // kept as string to match existing DB
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
    // ✅ FIELDS YOU ALREADY HAD (label tabs)
    // =========================================================

    ingredientsText: {
      type: String,
      default: "",
      trim: true,
    },

    allergens: {
      type: [String],
      default: [],
    },

    nutritionPer100g: {
      type: nutritionPer100gSchema,
      default: undefined, // important: keeps it absent unless you send it
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
    // ✅ ONLY ADD WHAT YOU WERE MISSING (mandatory/conditional)
    // =========================================================

    /**
     * Storage conditions (mandatory when applicable).
     * Example: "A se păstra la loc uscat și răcoros. După deschidere: la frigider."
     */
    storageConditions: {
      type: String,
      default: "",
      trim: true,
    },

    /**
     * Instructions for use (mandatory when needed).
     * Example: "A se agita înainte de consum."
     */
    instructionsForUse: {
      type: String,
      default: "",
      trim: true,
    },

    /**
     * Responsible operator (mandatory info).
     */
    foodBusinessOperator: {
      type: foodBusinessOperatorSchema,
      default: undefined,
    },

    /**
     * Importer (mandatory when applicable — e.g., products placed on EU market by an importer).
     * Keep it optional because not all products have an importer.
     */
    importer: {
      type: foodBusinessOperatorSchema,
      default: undefined,
    },

    /**
     * HIGH CAFFEINE beverages (energy drinks):
     * If the product requires the "High caffeine content..." warning,
     * store the caffeine level (mg/100ml) + warning text.
     */
    caffeineMgPer100ml: {
      type: Number,
      default: null, // e.g., 32 for 32 mg/100 ml
      min: 0,
    },

    highCaffeineWarningText: {
      type: String,
      default: "",
      trim: true,
      // Example:
      // "Conținut ridicat de cafeină. Nu este recomandat copiilor și femeilor însărcinate sau care alăptează."
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product;