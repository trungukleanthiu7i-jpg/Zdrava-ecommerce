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
   ✅ POST add product (IMAGE OPTIONAL)
====================================================== */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      name,
      description = "",
      price,
      stock,
      category,
      unitsPerBox,
      boxPerPalet,
      barcode = "",
    } = req.body;

    if (!name || !price || !stock || !category || !unitsPerBox || !boxPerPalet) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const image = req.file
      ? `/images/produse/${req.file.filename}`
      : ""; // ✅ IMAGE OPTIONAL

    const product = new Product({
      name,
      description,
      price,
      stock,
      category,
      unitsPerBox,
      boxPerPalet,
      barcode,
      image,
    });

    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("ADD PRODUCT ERROR:", err);
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

    // ✅ FIXED: reliable fetch
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
