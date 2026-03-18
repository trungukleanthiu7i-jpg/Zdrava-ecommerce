import axios from "axios";

const OBLIO_EMAIL = process.env.OBLIO_EMAIL;
const OBLIO_API_SECRET = process.env.OBLIO_API_SECRET;
const OBLIO_CIF = process.env.OBLIO_CIF;
const OBLIO_INVOICE_SERIES = process.env.OBLIO_INVOICE_SERIES;
const OBLIO_BASE_URL = "https://www.oblio.eu/api";

/* ======================================================
   GET ACCESS TOKEN
====================================================== */
export async function getOblioAccessToken() {
  try {
    const params = new URLSearchParams();
    params.append("client_id", OBLIO_EMAIL);
    params.append("client_secret", OBLIO_API_SECRET);

    const response = await axios.post(
      `${OBLIO_BASE_URL}/authorize/token`,
      params.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (!response?.data?.access_token) {
      throw new Error("No access token returned from Oblio");
    }

    return response.data.access_token;
  } catch (error) {
    console.error(
      "❌ Oblio auth error:",
      error.response?.data || error.message
    );
    throw new Error("Failed to authenticate with Oblio");
  }
}

/* ======================================================
   SHARED AUTH HEADER
====================================================== */
async function getOblioAuthConfig(extraConfig = {}) {
  const token = await getOblioAccessToken();

  return {
    ...extraConfig,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(extraConfig.headers || {}),
    },
  };
}

/* ======================================================
   GET INVOICE SERIES
====================================================== */
export async function getOblioInvoiceSeries() {
  try {
    const config = await getOblioAuthConfig({
      params: {
        cif: OBLIO_CIF,
      },
    });

    const response = await axios.get(
      `${OBLIO_BASE_URL}/nomenclature/series`,
      config
    );

    return response.data;
  } catch (error) {
    console.error(
      "❌ Oblio series error:",
      error.response?.data || error.message
    );
    throw new Error("Failed to fetch Oblio invoice series");
  }
}

/* ======================================================
   SEARCH PRODUCTS IN OBLIO
====================================================== */
export async function searchOblioProducts(name = "") {
  try {
    const config = await getOblioAuthConfig({
      params: {
        cif: OBLIO_CIF,
        name,
      },
    });

    const response = await axios.get(
      `${OBLIO_BASE_URL}/nomenclature/products`,
      config
    );

    return response.data;
  } catch (error) {
    console.error(
      "❌ Oblio products search error:",
      error.response?.data || error.message
    );
    throw new Error("Failed to search Oblio products");
  }
}

/* ======================================================
   CREATE INVOICE
====================================================== */
export async function createOblioInvoice(invoiceData) {
  try {
    const config = await getOblioAuthConfig({
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await axios.post(
      `${OBLIO_BASE_URL}/docs/invoice`,
      {
        cif: OBLIO_CIF,
        seriesName: OBLIO_INVOICE_SERIES,
        ...invoiceData,
      },
      config
    );

    return response.data;
  } catch (error) {
    console.error(
      "❌ Oblio create invoice error:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.statusMessage ||
        error.response?.data?.message ||
        "Failed to create invoice in Oblio"
    );
  }
}

/* ======================================================
   EXPORTED CONSTANTS
====================================================== */
export { OBLIO_CIF, OBLIO_INVOICE_SERIES };