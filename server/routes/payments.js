import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import {
  createOblioInvoice,
  searchOblioProducts,
} from "../services/oblioService.js";
import { createNetopiaPaymentPayload } from "../services/netopiaService.js";

const router = express.Router();

/* ======================================================
   HELPERS
====================================================== */
const OBLIO_WORKSTATION = "Depozit";
const OBLIO_MANAGEMENT = "Depozit";

function getClientDataFromOrder(order) {
  const isCompany = order.customerType === "company";

  if (isCompany) {
    return {
      name: order.company?.companyName || order.customer?.fullName || "Client",
      cif: order.company?.vatNumber || "",
      rc: order.company?.vatNumber || "",
      address: order.shippingAddress?.addressLine || "",
      state: order.shippingAddress?.country || "",
      city: order.shippingAddress?.city || "",
      country: order.shippingAddress?.country || "Romania",
      email: order.customer?.email || "",
      phone: order.customer?.phone || "",
    };
  }

  return {
    name: order.customer?.fullName || "Client persoana fizica",
    address: order.shippingAddress?.addressLine || "",
    state: order.shippingAddress?.country || "",
    city: order.shippingAddress?.city || "",
    country: order.shippingAddress?.country || "Romania",
    email: order.customer?.email || "",
    phone: order.customer?.phone || "",
  };
}

async function buildOblioProductsFromOrder(order) {
  const oblioProducts = [];

  for (const item of order.items) {
    const productName = item.name;

    const productSearch = await searchOblioProducts(productName);
    const foundProducts = Array.isArray(productSearch?.data)
      ? productSearch.data
      : Array.isArray(productSearch?.data?.data)
      ? productSearch.data.data
      : Array.isArray(productSearch?.data?.records)
      ? productSearch.data.records
      : [];

    const exactProduct = foundProducts.find((p) => p.name === productName);

    if (!exactProduct) {
      throw new Error(`Product "${productName}" was not found in Oblio.`);
    }

    const stockEntry = Array.isArray(exactProduct.stock)
      ? exactProduct.stock.find(
          (s) =>
            s.workStation === OBLIO_WORKSTATION &&
            s.management === OBLIO_MANAGEMENT
        )
      : null;

    if (!stockEntry) {
      throw new Error(
        `Product "${productName}" was not found in Oblio stock for ${OBLIO_WORKSTATION}/${OBLIO_MANAGEMENT}.`
      );
    }

    const quantity = Number(item.boxes || 0) * Number(item.unitsPerBox || 1);

    if (quantity <= 0) {
      continue;
    }

    oblioProducts.push({
      name: exactProduct.name,
      quantity,
      price: Number(item.unitPrice || 0),
      measuringUnit: exactProduct.measuringUnit || "BUC",
      vatName: stockEntry.vatName,
      vatPercentage: Number(stockEntry.vatPercentage || 0),
      vatIncluded: stockEntry.vatIncluded ? 1 : 0,
      productType: exactProduct.productType || "Marfa",
      management: OBLIO_MANAGEMENT,
      save: 0,
    });
  }

  if (oblioProducts.length === 0) {
    throw new Error("No valid products found for Oblio invoice.");
  }

  return oblioProducts;
}

async function issueOblioInvoiceForOrder(order) {
  if (order.oblioInvoice?.issued) {
    return order.oblioInvoice;
  }

  const today = new Date().toISOString().split("T")[0];
  const client = getClientDataFromOrder(order);
  const products = await buildOblioProductsFromOrder(order);

  const payload = {
    client,
    workStation: OBLIO_WORKSTATION,
    products,
    issueDate: today,
    dueDate: today,
    currency: order.currency || "RON",
    language: order.currency === "EUR" ? "EN" : "RO",
    precision: 2,
    sendEmail: 0,
    orderNumber: order.orderNumber,
  };

  const result = await createOblioInvoice(payload);

  const invoiceData = result?.data || {};

  order.oblioInvoice = {
    issued: true,
    invoiceId: invoiceData.id ? String(invoiceData.id) : "",
    seriesName: invoiceData.seriesName || "",
    number: invoiceData.number || "",
    link: invoiceData.link || "",
    einvoice: invoiceData.einvoice || "",
    total: Number(invoiceData.total || 0),
    issuedAt: new Date(),
    error: "",
  };

  await order.save();

  return order.oblioInvoice;
}

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

    if (!paymentMethod) {
      return res.status(400).json({ message: "Payment method is required." });
    }

    /* -------------------------------
       FETCH PRODUCTS
    -------------------------------- */
    const ids = cart.map((c) => c.productId);
    const products = await Product.find({ _id: { $in: ids } });

    const productMap = new Map(products.map((p) => [String(p._id), p]));

    /* -------------------------------
       BUILD ORDER ITEMS
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
       CREATE ORDER
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
      provider: paymentMethod === "NETOPIA" ? "NETOPIA" : "",
    });

    /* =====================================================
       SYNC USER PROFILE
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

    /* =====================================================
       NETOPIA PAYMENT
    ===================================================== */
    if (paymentMethod === "NETOPIA") {
      const details = `Order ${order.orderNumber || order._id}`;

      const paymentPayload = createNetopiaPaymentPayload({
        orderId: String(order._id),
        amount: Number(order.total || 0),
        currency: order.currency || "RON",
        details,
        customer: order.customer,
        shippingAddress: order.shippingAddress,
        customerType: order.customerType,
      });

      return res.json({
        success: true,
        message: "Order created successfully.",
        orderId: order._id,
        updatedUser,
        paymentMethod: "NETOPIA",
        paymentUrl: paymentPayload.url,
        formData: {
          env_key: paymentPayload.env_key,
          data: paymentPayload.data,
          cipher: paymentPayload.cipher,
          iv: paymentPayload.iv,
        },
      });
    }

    /* =====================================================
       IBAN / MANUAL PAYMENT
    ===================================================== */
    let instructions = null;

    if (paymentMethod === "IBAN_RON") {
      instructions = {
        title: "Plată prin transfer bancar (RON)",
        details: [
          "Beneficiar: MERITA LOGISTIC S.R.L.",
          "Valuta: RON",
          `Număr comandă: ${order.orderNumber || order._id}`,
          "Vă rugăm să menționați numărul comenzii în detaliile plății.",
        ],
      };
    }

    if (paymentMethod === "IBAN_EUR") {
      instructions = {
        title: "Plată prin transfer bancar (EUR)",
        details: [
          "Beneficiar: MERITA LOGISTIC S.R.L.",
          "Valuta: EUR",
          `Număr comandă: ${order.orderNumber || order._id}`,
          "Vă rugăm să menționați numărul comenzii în detaliile plății.",
        ],
      };
    }

    return res.json({
      success: true,
      message: "Order created successfully.",
      orderId: order._id,
      updatedUser,
      instructions,
    });
  } catch (err) {
    console.error("❌ payments/initiate error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ======================================================
   CONFIRM PAYMENT + ISSUE OBLIO INVOICE
====================================================== */
router.post("/confirm/:orderId", authMiddleware, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { provider = "", providerRef = "" } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    if (
      String(order.userId) !== String(req.user.id) &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not allowed." });
    }

    if (order.paymentStatus !== "paid") {
      order.paymentStatus = "paid";
      order.status = "paid";
      order.provider = provider;
      order.providerRef = providerRef;
      await order.save();
    }

    if (!order.oblioInvoice?.issued) {
      try {
        await issueOblioInvoiceForOrder(order);
      } catch (invoiceError) {
        order.oblioInvoice = {
          ...(order.oblioInvoice || {}),
          issued: false,
          error: invoiceError.message,
        };
        await order.save();

        return res.status(500).json({
          message: "Payment confirmed but Oblio invoice failed.",
          error: invoiceError.message,
          order,
        });
      }
    }

    return res.json({
      message: "Payment confirmed and invoice processed successfully.",
      order,
    });
  } catch (err) {
    console.error("❌ payments/confirm error:", err);
    return res.status(500).json({
      message: err.message,
    });
  }
});

/* ======================================================
   ADMIN / RETRY OBLIO INVOICE
====================================================== */
router.post("/retry-oblio/:orderId", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only." });
    }

    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    if (order.paymentStatus !== "paid") {
      return res.status(400).json({
        message: "Invoice can only be issued for paid orders.",
      });
    }

    if (order.oblioInvoice?.issued) {
      return res.status(400).json({
        message: "Invoice already issued.",
        oblioInvoice: order.oblioInvoice,
      });
    }

    await issueOblioInvoiceForOrder(order);

    return res.json({
      message: "Oblio invoice issued successfully.",
      order,
    });
  } catch (err) {
    console.error("❌ payments/retry-oblio error:", err);
    return res.status(500).json({
      message: err.message,
    });
  }
});

export default router;