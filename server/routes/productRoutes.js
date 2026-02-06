import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import Product from "../models/Product.js";

const router = express.Router();

/* ======================================================
   🧩 Multer Storage Setup (IMAGES OPTIONAL)
====================================================== */
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "public/images/produse");
  },
  filename(req, file, cb) {
    const sanitized = file.originalname
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w.-]/g, "");
    cb(null, `${Date.now()}-${sanitized}`);
  },
});

const upload = multer({ storage });

/* ======================================================
   ✅ GET all products
====================================================== */
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().lean();
    res.json(products);
  } catch (err) {
    console.error("GET ALL PRODUCTS ERROR:", err);
    res.status(500).json({ message: "Error fetching products" });
  }
});

/* ======================================================
   🔍 SEARCH products
====================================================== */
router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.json([]);

    const regex = new RegExp(query, "i");

    const products = await Product.find({
      $or: [{ name: regex }, { description: regex }, { category: regex }],
    }).lean();

    res.json(products);
  } catch (err) {
    console.error("SEARCH ERROR:", err);
    res.status(500).json({ message: "Search error" });
  }
});

/* ======================================================
   ✅ GET products by category
====================================================== */
router.get("/category/:category", async (req, res) => {
  try {
    const products = await Product.find({
      category: { $regex: new RegExp(`^${req.params.category}$`, "i") },
    }).lean();

    res.json(products);
  } catch (err) {
    console.error("CATEGORY ERROR:", err);
    res.status(500).json({ message: "Category error" });
  }
});

/* ======================================================
   ✅ POST add product (IMAGE OPTIONAL + OPTIONAL FIELDS)
   ✅ Keeps your current image path format to avoid breaking anything
====================================================== */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    // 🔎 DEBUG: see what backend receives
    console.log("📦 REQ.BODY:", req.body);
    console.log("🖼️ REQ.FILE:", req.file ? req.file.filename : "no file");

    const {
      name,
      description = "",
      price,
      stock,
      category,

      // optional existing
      unitsPerBox = "",
      boxPerPalet = "",
      barcode = "",

      // ✅ NEW optional fields (tabs)
      ingredientsText = "",
      allergens = "",
      nutritionPer100g,
      originCountry = "",
      netWeight = "",
    } = req.body;

    // ✅ Only these are required (unchanged)
    const missing = [];
    if (!name || !String(name).trim()) missing.push("name");
    if (price === undefined || price === null || String(price).trim() === "")
      missing.push("price");
    if (!stock || !String(stock).trim()) missing.push("stock");
    if (!category || !String(category).trim()) missing.push("category");

    if (missing.length > 0) {
      return res
        .status(400)
        .json({ message: `Missing required fields: ${missing.join(", ")}` });
    }

    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice)) {
      return res.status(400).json({ message: "Price must be a number" });
    }

    // ✅ KEEP YOUR CURRENT IMAGE FORMAT (to avoid breaking anything)
    const image = req.file ? `/images/produse/${req.file.filename}` : "";

    // ✅ Parse allergens: allow "milk, soy" OR ["milk","soy"]
    let allergensArray = [];
    if (Array.isArray(allergens)) {
      allergensArray = allergens.map((a) => String(a).trim()).filter(Boolean);
    } else if (typeof allergens === "string") {
      allergensArray = allergens
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean);
    }

    // ✅ Parse nutritionPer100g:
    // - may arrive as object OR JSON string OR empty
    let nutritionObj;
    if (nutritionPer100g && typeof nutritionPer100g === "string") {
      try {
        const parsed = JSON.parse(nutritionPer100g);
        if (parsed && typeof parsed === "object") nutritionObj = parsed;
      } catch (e) {
        // ignore invalid JSON so product can still be added
        console.warn("⚠ nutritionPer100g not valid JSON, ignoring.");
      }
    } else if (nutritionPer100g && typeof nutritionPer100g === "object") {
      nutritionObj = nutritionPer100g;
    }

    // ✅ Clean nutrition object: remove empty values, convert numeric strings
    if (nutritionObj) {
      for (const key of Object.keys(nutritionObj)) {
        const v = nutritionObj[key];

        if (v === "" || v === null || v === undefined) {
          delete nutritionObj[key];
          continue;
        }

        if (typeof v === "string") {
          const trimmed = v.trim();
          if (trimmed === "") {
            delete nutritionObj[key];
            continue;
          }
          const asNum = Number(trimmed);
          if (!Number.isNaN(asNum)) nutritionObj[key] = asNum;
        }
      }

      if (Object.keys(nutritionObj).length === 0) nutritionObj = undefined;
    }

    const product = new Product({
      name: String(name).trim(),
      description,
      price: numericPrice,
      stock,
      category,

      // keep as strings
      unitsPerBox: unitsPerBox ? String(unitsPerBox) : "",
      boxPerPalet: boxPerPalet ? String(boxPerPalet) : "",
      barcode: barcode ? String(barcode) : "",
      image,

      // ✅ NEW optional fields
      ingredientsText: ingredientsText ? String(ingredientsText) : "",
      allergens: allergensArray,
      ...(nutritionObj ? { nutritionPer100g: nutritionObj } : {}),
      originCountry: originCountry ? String(originCountry) : "",
      netWeight: netWeight ? String(netWeight) : "",
    });

    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("ADD PRODUCT ERROR:", err);

    // ✅ if mongoose validation fails, show the real reason
    if (err?.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }

    res.status(500).json({ message: "Add product failed" });
  }
});

/* ======================================================
   ✅ GET product by ID (MUST BE LAST)
====================================================== */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const product = await Product.findOne({ _id: id }).lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error("GET BY ID ERROR:", err);
    res.status(500).json({ message: "Fetch by ID failed" });
  }
});

export default router;
