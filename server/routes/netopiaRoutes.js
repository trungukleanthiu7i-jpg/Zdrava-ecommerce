import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Order from "../models/Order.js";
import {
  createNetopiaPaymentPayload,
  decryptNetopiaResponse,
  parseNetopiaIpnXml,
  isNetopiaPaymentSuccessful,
  buildNetopiaAckXml,
} from "../services/netopiaService.js";
import {
  createOblioInvoice,
  searchOblioProducts,
} from "../services/oblioService.js";

const router = express.Router();

const OBLIO_WORKSTATION = "Depozit";
const OBLIO_MANAGEMENT = "Depozit";

/* ======================================================
   HELPERS
====================================================== */
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
    const foundProducts = Array.isArray(productSearch)
      ? productSearch
      : Array.isArray(productSearch?.data)
      ? productSearch.data
      : Array.isArray(productSearch?.records)
      ? productSearch.records
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

    const pieces = Number(item.pieces || 0);
    const boxes = Number(item.boxes || 0);
    const pallets = Number(item.pallets || 0);
    const unitsPerBox = Number(item.unitsPerBox || 1);
    const boxPerPalet = Number(item.boxPerPalet || 0);

    const quantity =
      pieces +
      boxes * unitsPerBox +
      pallets * boxPerPalet * unitsPerBox;

    if (quantity <= 0) continue;

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

  console.log("🧾 OBLIO INVOICE CLIENT:", client);
  console.log("🧾 OBLIO INVOICE PRODUCTS:", JSON.stringify(products, null, 2));

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

  console.log("🧾 OBLIO INVOICE PAYLOAD:", JSON.stringify(payload, null, 2));

  const invoiceData = await createOblioInvoice(payload);

  console.log("🧾 OBLIO INVOICE RESPONSE:", invoiceData);

  order.oblioInvoice = {
    issued: true,
    invoiceId: invoiceData?.id ? String(invoiceData.id) : "",
    seriesName: invoiceData?.seriesName || "",
    number: invoiceData?.number || "",
    link: invoiceData?.link || "",
    einvoice: invoiceData?.einvoice || "",
    total: Number(invoiceData?.total || 0),
    issuedAt: new Date(),
    error: "",
  };

  await order.save();
  return order.oblioInvoice;
}

/* ======================================================
   START NETOPIA PAYMENT
====================================================== */
router.post("/start/:orderId", authMiddleware, async (req, res) => {
  try {
    const { orderId } = req.params;

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

    if (order.paymentStatus === "paid") {
      return res.status(400).json({
        message: "Order is already paid.",
        order,
      });
    }

    const details = `Order ${order.orderNumber || order._id}`;

    const payload = createNetopiaPaymentPayload({
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
      paymentUrl: payload.url,
      formData: {
        env_key: payload.env_key,
        data: payload.data,
        cipher: payload.cipher,
        iv: payload.iv,
      },
      orderId: order._id,
      orderNumber: order.orderNumber,
    });
  } catch (err) {
    console.error("❌ netopia/start error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ======================================================
   NETOPIA CONFIRM / IPN
====================================================== */
router.post(
  "/confirm",
  express.urlencoded({ extended: true }),
  async (req, res) => {
    try {
      console.log("🔥 NETOPIA CONFIRM HIT");
      console.log("📥 NETOPIA RAW BODY:", req.body);

      const { env_key, data, iv, cipher } = req.body;

      if (!env_key || !data) {
        console.log("❌ NETOPIA CONFIRM MISSING env_key OR data");

        const ack = buildNetopiaAckXml({
          errorType: "temporary",
          errorCode: "100",
          message: "Missing env_key or data",
        });

        res.set("Content-Type", "application/xml");
        return res.status(200).send(ack);
      }

      const decryptedXml = decryptNetopiaResponse({
        env_key,
        data,
        iv,
        cipher: cipher || "aes-256-cbc",
      });

      console.log("📩 NETOPIA DECRYPTED XML:", decryptedXml);

      const ipn = parseNetopiaIpnXml(decryptedXml);
      console.log("📦 NETOPIA PARSED IPN:", ipn);

      if (!ipn.orderId) {
        console.log("❌ NETOPIA IPN MISSING ORDER ID");

        const ack = buildNetopiaAckXml({
          errorType: "temporary",
          errorCode: "101",
          message: "Missing order id in NETOPIA response",
        });

        res.set("Content-Type", "application/xml");
        return res.status(200).send(ack);
      }

      const order = await Order.findById(ipn.orderId);

      if (!order) {
        console.log("❌ NETOPIA ORDER NOT FOUND:", ipn.orderId);

        const ack = buildNetopiaAckXml({
          errorType: "temporary",
          errorCode: "102",
          message: "Order not found",
        });

        res.set("Content-Type", "application/xml");
        return res.status(200).send(ack);
      }

      console.log("🧾 ORDER FOUND:", {
        id: String(order._id),
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
      });

      const successful = isNetopiaPaymentSuccessful(ipn);
      console.log("✅ NETOPIA PAYMENT SUCCESS:", successful);

      if (successful) {
        if (order.paymentStatus !== "paid") {
          order.paymentStatus = "paid";
          order.status = "paid";
        }

        order.provider = "NETOPIA";
        order.providerRef = ipn.purchaseId || ipn.crc || "";

        await order.save();

        console.log("✅ ORDER MARKED AS PAID:", {
          id: String(order._id),
          status: order.status,
          paymentStatus: order.paymentStatus,
          providerRef: order.providerRef,
        });

        if (!order.oblioInvoice?.issued) {
          try {
            console.log("🧾 TRYING OBLIO INVOICE FOR ORDER:", order._id);
            console.log(
              "🧾 ORDER ITEMS:",
              JSON.stringify(order.items, null, 2)
            );

            await issueOblioInvoiceForOrder(order);

            console.log("✅ OBLIO INVOICE CREATED SUCCESSFULLY");
          } catch (invoiceError) {
            console.error("❌ Oblio invoice creation failed:", invoiceError);
            console.error(
              "❌ Oblio invoice error message:",
              invoiceError.message
            );

            order.oblioInvoice = {
              ...(order.oblioInvoice || {}),
              issued: false,
              error: invoiceError.message,
            };

            await order.save();
          }
        }
      } else {
        console.log(
          "⚠️ NETOPIA PAYMENT NOT SUCCESSFUL. ACTION:",
          String(ipn.action || "").toLowerCase()
        );

        if (
          ["canceled", "cancelled", "credit"].includes(
            String(ipn.action || "").toLowerCase()
          )
        ) {
          order.paymentStatus = "failed";
          order.status = "cancelled";
          order.provider = "NETOPIA";
          order.providerRef = ipn.purchaseId || ipn.crc || "";
          await order.save();

          console.log("⚠️ ORDER MARKED AS FAILED/CANCELLED");
        }
      }

      const ack = buildNetopiaAckXml({
        message: "OK",
      });

      res.set("Content-Type", "application/xml");
      return res.status(200).send(ack);
    } catch (err) {
      console.error("❌ netopia/confirm error:", err);

      const ack = buildNetopiaAckXml({
        errorType: "temporary",
        errorCode: "500",
        message: err.message || "Internal error",
      });

      res.set("Content-Type", "application/xml");
      return res.status(200).send(ack);
    }
  }
);

/* ======================================================
   SIMPLE RETURN PAGE HELPER
====================================================== */
router.get("/return", async (req, res) => {
  try {
    return res.redirect(
      process.env.NETOPIA_RETURN_URL || process.env.FRONTEND_URL || "/"
    );
  } catch (err) {
    console.error("❌ netopia/return error:", err);
    return res.redirect(process.env.FRONTEND_URL || "/");
  }
});

export default router;