import axios from "axios";

/* ======================================================
   Axios Client (Central API Handler)
====================================================== */

/**
 * ✅ Base API URL
 * - Production: uses REACT_APP_API_URL and APPENDS `/api`
 * - Development: falls back to localhost backend
 *
 * IMPORTANT:
 * REACT_APP_API_URL should be:
 *   https://zdrava-ecommerce-backend.onrender.com
 * NOT include /api
 */
const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL
    ? `${process.env.REACT_APP_API_URL}/api`
    : "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/* ======================================================
   🔐 Automatically attach JWT token to every request
====================================================== */
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ======================================================
   ❌ Global response handler
====================================================== */
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("⚠️ Unauthorized – token may be expired");
      // Optional auto-logout:
      // localStorage.removeItem("token");
      // window.location.href = "/auth";
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
