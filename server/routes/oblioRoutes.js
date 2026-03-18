import express from "express";
import {
  getOblioAccessToken,
  getOblioInvoiceSeries,
  searchOblioProducts,
  createOblioInvoice,
  OBLIO_INVOICE_SERIES,
} from "../services/oblioService.js";

const router = express.Router();

router.get("/test-token", async (req, res) => {
  try {
    const token = await getOblioAccessToken();

    if (!token) {
      return res.status(500).json({
        success: false,
        message: "No access token returned from Oblio",
      });
    }

    return res.json({
      success: true,
      message: "Oblio token generated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/test-series", async (req, res) => {
  try {
    const data = await getOblioInvoiceSeries();

    const possibleSeries =
      data?.data || data?.series || data?.records || data || [];

    const allSeries = Array.isArray(possibleSeries) ? possibleSeries : [];

    const matchedSeries = allSeries.find(
      (item) =>
        item?.name === OBLIO_INVOICE_SERIES ||
        item?.seriesName === OBLIO_INVOICE_SERIES ||
        item?.prefix === OBLIO_INVOICE_SERIES
    );

    return res.json({
      success: true,
      selectedSeries: OBLIO_INVOICE_SERIES,
      seriesExists: !!matchedSeries,
      allSeries,
      raw: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/test-product", async (req, res) => {
  try {
    const productName =
      req.query.name || "Castraveți cornichon murați 2Kg";

    const data = await searchOblioProducts(productName);

    return res.json({
      success: true,
      searchedName: productName,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/test-create-invoice", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const data = await createOblioInvoice({
      client: {
        name: "Client Test Zdrava",
        cif: "12345678",
        rc: "J00/0000/0000",
        address: "Craiova",
        state: "Dolj",
        city: "Craiova",
        country: "Romania",
        email: "test@example.com",
        phone: "0700000000",
      },

      // IMPORTANT: this must be at document level, not inside product
      workStation: "Depozit",

      products: [
        {
          name: "Castraveți cornichon murați 2Kg",
          quantity: 1,
          price: 17.2,
          measuringUnit: "BUC",
          vatName: "Redusa",
          vatPercentage: 11,
          vatIncluded: 1,
          productType: "Marfa",
          management: "Depozit",
          save: 0,
        },
      ],

      issueDate: today,
      dueDate: today,
      currency: "RON",
      language: "RO",
      precision: 2,
      sendEmail: 0,
    });

    return res.json({
      success: true,
      message: "Invoice created with exact Oblio stock product data",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;