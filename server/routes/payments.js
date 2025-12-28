import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

const router = express.Router();

/* ======================================================
   INITIATE PAYMENT / CREATE ORDER
====================================================== */
router.post("/initiate", authMiddleware, async (req, res) => {
  try {
    const {
      cart,
      currency = "RON",
      paymentMethod,
      customerType,
      customer,
      company,
      shippingAddress,
    } = req.body;

    /* -------------------------------
       VALIDATION
    -------------------------------- */
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty." });
    }

    if (!["individual", "company"].includes(customerType)) {
      return res.status(400).json({ message: "Invalid customer type." });
    }

    /* -------------------------------
       FETCH PRODUCTS
    -------------------------------- */
    const ids = cart.map((c) => c.productId);
    const products = await Product.find({ _id: { $in: ids } });

    const productMap = new Map(
      products.map((p) => [String(p._id), p])
    );

    /* -------------------------------
       BUILD ORDER ITEMS (CRITICAL)
    -------------------------------- */
    const items = [];
    let subtotal = 0;

    for (const c of cart) {
      const p = productMap.get(String(c.productId));
      if (!p) {
        return res.status(400).json({
          message: "Product not found.",
        });
      }

      const boxes = Number(c.quantity || 0);
      if (boxes <= 0) continue;

      const unitsPerBox = Number(p.unitsPerBox || 1);
      const unitPrice = Number(p.price || 0);

      const totalUnits = boxes * unitsPerBox;
      const lineTotal = totalUnits * unitPrice;

      items.push({
        productId: p._id,
        name: p.name,
        image: p.image,
        unitPrice,
        unitsPerBox,
        boxes,
        pallets: Number(c.pallets || 0),
        lineTotal,
      });

      subtotal += lineTotal;
    }

    if (items.length === 0) {
      return res.status(400).json({
        message: "Cart quantities invalid.",
      });
    }

    /* -------------------------------
       TOTALS
    -------------------------------- */
    const shipping = 0;
    const total = subtotal + shipping;

    /* -------------------------------
       CREATE ORDER (NOW IT PASSES)
    -------------------------------- */
    const order = await Order.create({
      userId: req.user.id,
      customerType,
      customer,
      company: customerType === "company" ? company : null,
      shippingAddress,
      items,
      currency,
      subtotal,
      shipping,
      total,
      paymentMethod,
      status: "pending_payment",
      paymentStatus: "unpaid",
    });

    /* =====================================================
       🔄 SYNC USER PROFILE (UPGRADE ONLY)
    ===================================================== */
    if (customerType === "company") {
      await User.findByIdAndUpdate(req.user.id, {
        $set: {
          accountType: "company",
          email: customer.email,
          phone: customer.phone,
          shippingAddress,
          company: {
            companyName: company.companyName,
            vatNumber: company.vatNumber,
            email: customer.email,
            phone: customer.phone,
            invoiceAddress: shippingAddress,
          },
        },
      });
    }

    const updatedUser = await User.findById(req.user.id).select("-password");

    return res.json({
      message: "Order created successfully.",
      orderId: order._id,
      updatedUser,
    });

  } catch (err) {
    console.error("❌ payments/initiate error:", err);
    return res.status(500).json({
      message: err.message,
    });
  }
});

export default router;
