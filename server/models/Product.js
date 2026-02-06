// models/product.js
import mongoose from "mongoose";

/**
 * Optional sub-schema for nutrition values (per 100g).
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
    // Optional + default, so product can be created even if you don't set it
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
    // ✅ NEW OPTIONAL FIELDS (for product tabs)
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
      default: undefined, // important: keeps it absent unless you send it
    },

    // Characteristics (optional)
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
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
