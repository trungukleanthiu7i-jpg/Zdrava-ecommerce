import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import Order from "../models/Order.js";
import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";
import bwipjs from "bwip-js";

const router = express.Router();

/* ======================================================
   🛒 CREATE ORDER (CLIENT ONLY)
====================================================== */
router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role === "admin") {
      return res.status(403).json({
        message: "Admins are not allowed to create orders",
      });
    }

    const {
      customerType,
      customer,
      company,
      shippingAddress,
      items,
      subtotal,
      shipping,
      total,
      currency,
      paymentMethod,
      notes,
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order has no items." });
    }

    const order = await Order.create({
      userId: req.user._id,
      customerType,
      customer,
      company: customerType === "company" ? company : null,
      shippingAddress,
      items,
      subtotal,
      shipping,
      total,
      currency,
      paymentMethod,
      notes,
      status: "created",
      paymentStatus: "unpaid",
    });

    res.status(201).json(order);
  } catch (err) {
    console.error("❌ Create order error:", err);
    res.status(500).json({ message: "Failed to create order" });
  }
});

/* ======================================================
   🧑 USER — MY ORDERS
====================================================== */
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("❌ Fetch my orders error:", err);
    res.status(500).json({ message: "Failed to fetch user orders" });
  }
});

/* ======================================================
   🧑 USER — SINGLE ORDER (DETAILS)
====================================================== */
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user._id, // 🔒 only own orders
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.error("❌ Fetch single order error:", err);
    res.status(500).json({ message: "Failed to fetch order" });
  }
});

/* ======================================================
   🛠 ADMIN — ALL ORDERS
====================================================== */
router.get("/admin/all", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: "items.productId",
        select: "barcode unitsPerBox",
      })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("❌ Fetch admin orders error:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

/* ======================================================
   📄 ADMIN — ORDER PDF
====================================================== */
router.get(
  "/admin/:id/pdf",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const order = await Order.findById(req.params.id).populate({
        path: "items.productId",
        select: "barcode unitsPerBox",
      });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      const doc = new PDFDocument({ margin: 40, size: "A4" });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=Order_${order.orderNumber}.pdf`
      );

      doc.pipe(res);

      /* ===== LOGO ===== */
      const logoPath = path.join(
        process.cwd(),
        "public",
        "Zdrava-logo-color.png"
      );

      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 380, 30, { width: 180 });
      }

      /* ===== HEADER ===== */
      doc
        .font("Helvetica-Bold")
        .fontSize(16)
        .text(`Order #${order.orderNumber}`, 40, 40);

      doc
        .font("Helvetica")
        .fontSize(10)
        .text(`Date: ${order.createdAt.toLocaleDateString()}`)
        .text(`Status: ${order.status}`)
        .text(`Currency: ${order.currency}`)
        .text(`Payment: ${order.paymentMethod}`);

      doc.moveDown(1.5);

      /* ===== TABLE ===== */
      const startX = 40;
      let y = doc.y;
      const rowH = 22;
      const colW = [150, 40, 55, 55, 65, 65, 80];

      const headers = [
        "Product",
        "Boxes",
        "Units/Box",
        "Total Units",
        "Unit Price",
        "Line Total",
        "Barcode",
      ];

      doc.fillColor("#2f80c0").rect(startX, y, 510, rowH).fill();
      doc.fillColor("white").font("Helvetica-Bold").fontSize(9);

      let x = startX;
      headers.forEach((h, i) => {
        doc.text(h, x + 4, y + 6, { width: colW[i] - 6 });
        x += colW[i];
      });

      doc.fillColor("black");
      y += rowH;

      for (const item of order.items) {
        x = startX;
        const totalUnits = item.boxes * (item.unitsPerBox || 1);

        const values = [
          item.name,
          item.boxes,
          item.unitsPerBox || "-",
          totalUnits,
          `${item.unitPrice.toFixed(2)} ${order.currency}`,
          `${item.lineTotal.toFixed(2)} ${order.currency}`,
        ];

        doc.font("Helvetica").fontSize(8);
        values.forEach((v, idx) => {
          doc.text(String(v), x + 4, y + 6, {
            width: colW[idx] - 6,
          });
          x += colW[idx];
        });

        const barcodeValue =
          item.barcode || item.productId?.barcode;

        if (barcodeValue) {
          const png = await bwipjs.toBuffer({
            bcid: "code128",
            text: String(barcodeValue),
            scale: 1,
            height: 6,
            includetext: false,
          });

          doc.image(png, startX + 430, y + 5, { width: 70 });
        }

        y += rowH;
      }

      doc.moveDown(2);
      doc
        .font("Helvetica-Bold")
        .fontSize(14)
        .text(
          `TOTAL: ${order.total.toFixed(2)} ${order.currency}`,
          { align: "right" }
        );

      doc.end();
    } catch (err) {
      console.error("❌ PDF error:", err);
      res.status(500).json({ message: "Failed to generate PDF" });
    }
  }
);

export default router;
