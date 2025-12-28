import axios from "axios";

/* ======================================================
   Axios Client (Central API Handler)
====================================================== */

// Use environment variable if available (production),
// fallback to localhost for development
const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
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
   ❌ Global response handler (optional but professional)
====================================================== */
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optional: auto-logout on 401
    if (error.response?.status === 401) {
      console.warn("⚠️ Unauthorized – token may be expired");
      // localStorage.removeItem("token");
      // window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
