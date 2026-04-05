import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import passport from "passport";

// ✅ Load Passport strategies
import "./config/passport.js";

// ✅ Routes
import productRoutes from "./routes/productRoutes.js";
import offerRoutes from "./routes/offerRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import paymentsRoutes from "./routes/payments.js";
import netopiaRoutes from "./routes/netopiaRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import authOAuthRoutes from "./routes/authOAuthRoutes.js";
import oblioRoutes from "./routes/oblioRoutes.js";

/**
 * ENV loading
 * - Render uses dashboard env vars
 * - Local uses .env
 */
dotenv.config();

const app = express();

/* =========================
   🌍 CORS CONFIG
========================= */
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  process.env.FRONTEND_URL,
  "https://albaniaproduct.com",
  "https://www.albaniaproduct.com",
  "https://zdrava-ecommerce-frontend-lv0k.onrender.com",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (Postman, server-to-server, health checks)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

/* =========================
   📦 BODY PARSERS
========================= */
// ✅ Important for payment providers that may send form-encoded data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 🔐 Initialize Passport (OAuth)
app.use(passport.initialize());

/* =========================
   🖼️ STATIC FILES
========================= */
const __dirname = path.resolve();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use(express.static(path.join(__dirname, "public")));

/* =========================
   🗄️ MONGODB CONNECTION
========================= */
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    console.log("✅ Connected DB:", mongoose.connection.name);
    console.log("✅ Allowed CORS origins:", allowedOrigins);
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

/* =========================
   🔌 API ROUTES
========================= */
app.use("/api/products", productRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/payments/netopia", netopiaRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authOAuthRoutes);
app.use("/api/oblio", oblioRoutes);

/* =========================
   ❤️ HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.send("🌿 Zdrava API is running...");
});

/* =========================
   🚀 START SERVER
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});