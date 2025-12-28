import express from "express";
import OfferProduct from "../models/OfferProduct.js";

const router = express.Router();

/* ======================================================
   ✅ GET all offer products
====================================================== */
router.get("/", async (req, res) => {
  try {
    const offers = await OfferProduct.find().sort({ createdAt: -1 });
    res.json(offers);
  } catch (err) {
    console.error("Error fetching offers:", err);
    res.status(500).json({ message: "Error fetching offers" });
  }
});

/* ======================================================
   ✅ POST add offer product (using existing image)
====================================================== */
router.post("/", async (req, res) => {
  try {
    const {
      name,
      description,
      oldPrice,
      newPrice,
      offerEndDate,
      conditions,
      existingImage,
    } = req.body;

    // 🟢 Check for required fields
    if (!name || !oldPrice || !newPrice || !offerEndDate || !existingImage) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 🟢 Normalize image path to match your project folder structure
    let imagePath = existingImage.trim();

    // Fix potential path variations
    if (imagePath.includes("/images/produce/")) {
      // Fix typo “produce” → “produse”
      imagePath = imagePath.replace("/images/produce/", "/images/produse/");
    } else if (!imagePath.startsWith("/images/produse/")) {
      // If it’s just a filename, prepend the folder
      const filename = imagePath.split("/").pop();
      imagePath = `/images/produse/${filename}`;
    }

    // 🟢 Create and save the offer product
    const newOffer = new OfferProduct({
      name,
      description,
      oldPrice: parseFloat(oldPrice),
      newPrice: parseFloat(newPrice),
      image: imagePath,
      offerEndDate: new Date(offerEndDate),
      conditions,
    });

    const savedOffer = await newOffer.save();
    console.log("✅ Offer added:", savedOffer.name, "| Image:", imagePath);
    res.status(201).json(savedOffer);
  } catch (err) {
    console.error("Error adding offer:", err);
    res.status(500).json({ message: "Error adding offer" });
  }
});

export default router;
