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
   ✅ GET products
   - all products
   - or filtered by category with ?category=
====================================================== */
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;

    const query = {};

    if (category && String(category).trim()) {
      query.category = {
        $regex: new RegExp(`^${String(category).trim()}$`, "i"),
      };
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1, _id: -1 })
      .lean();

    res.json(products);
  } catch (err) {
    console.error("GET PRODUCTS ERROR:", err);
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
====================================================== */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    console.log("📦 REQ.BODY:", req.body);
    console.log("🖼️ REQ.FILE:", req.file ? req.file.filename : "no file");

    const {
      name,
      description = "",
      price,
      stock,
      category,
      unitsPerBox = "",
      boxPerPalet = "",
      barcode = "",
      ingredientsText = "",
      allergens = "",
      nutritionPer100g,
      originCountry = "",
      netWeight = "",
    } = req.body;

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

    const image = req.file ? `/images/produse/${req.file.filename}` : "";

    let allergensArray = [];
    if (Array.isArray(allergens)) {
      allergensArray = allergens.map((a) => String(a).trim()).filter(Boolean);
    } else if (typeof allergens === "string") {
      allergensArray = allergens
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean);
    }

    let nutritionObj;
    if (nutritionPer100g && typeof nutritionPer100g === "string") {
      try {
        const parsed = JSON.parse(nutritionPer100g);
        if (parsed && typeof parsed === "object") nutritionObj = parsed;
      } catch (e) {
        console.warn("⚠ nutritionPer100g not valid JSON, ignoring.");
      }
    } else if (nutritionPer100g && typeof nutritionPer100g === "object") {
      nutritionObj = nutritionPer100g;
    }

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
      unitsPerBox: unitsPerBox ? String(unitsPerBox) : "",
      boxPerPalet: boxPerPalet ? String(boxPerPalet) : "",
      barcode: barcode ? String(barcode) : "",
      image,
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