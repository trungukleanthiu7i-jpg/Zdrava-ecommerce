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
import orderRoutes from "./routes/orderRoutes.js";
import authOAuthRoutes from "./routes/authOAuthRoutes.js";

dotenv.config({ path: path.resolve("./.env") });

const app = express();

/* =========================
   🧰 MIDDLEWARE
========================= */
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

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
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) =>
    console.error("❌ MongoDB connection error:", err)
  );

/* =========================
   🔌 API ROUTES
========================= */
app.use("/api/products", productRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes); // existing login/register
app.use("/api/payments", paymentsRoutes);
app.use("/api/orders", orderRoutes);

// 🔐 OAuth routes (Google / Facebook)
app.use("/api/auth", authOAuthRoutes);

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
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
