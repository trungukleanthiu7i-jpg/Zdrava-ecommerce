import mongoose from "mongoose";

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

    price: {
      type: Number,
      required: true,
    },

    // ---------------- STOCK ----------------
    // Must be TEXT, not number
    stock: {
      type: String,
      enum: ["in stock", "out of stock"],
      required: true,
    },

    // ---------------- LOGISTICS ----------------
    unitsPerBox: {
      type: String, // keep string to match existing DB
      required: true,
    },

    boxPerPalet: {
      type: String, // keep string to match existing DB
      required: true,
    },

    // ---------------- IDENTIFICATION ----------------
    barcode: {
      type: String,
      default: "", // optional
    },

    // ---------------- IMAGE ----------------
    image: {
      type: String,
      default: "", // optional (VERY IMPORTANT)
    },

    // ---------------- CATEGORY ----------------
    category: {
      type: String,
      required: true,
      enum: [
        "Croissant",
        "Drinks",
        "Pickles",
        "Stuffed-peppers",
        "Jam",
        "Sweets",
        "Sauce",
        "Others",
        "restaurant-products",
        "patisserie-products",
      ],
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
