import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

// ✅ Routes
import productRoutes from "./routes/productRoutes.js";
import offerRoutes from "./routes/offerRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import paymentsRoutes from "./routes/payments.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config({ path: path.resolve("./.env") });

const app = express();

// 🧰 Middleware
app.use(cors());
app.use(express.json());

// 🖼️ Static file serving
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use(express.static(path.join(__dirname, "public")));

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) =>
    console.error("❌ MongoDB connection error:", err)
  );

// ✅ API Routes (REGISTER ONCE!)
app.use("/api/products", productRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);     // ✅ ONLY ONCE
app.use("/api/payments", paymentsRoutes);
app.use("/api/orders", orderRoutes);

// ✅ Health check
app.get("/", (req, res) => {
  res.send("🌿 Zdrava API is running...");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
