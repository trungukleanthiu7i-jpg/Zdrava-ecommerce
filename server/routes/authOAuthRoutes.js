import express from "express";
import passport from "../config/passport.js";
import jwt from "jsonwebtoken";

const router = express.Router();

/* =========================
   🔐 JWT GENERATOR
========================= */
const generateToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

/* =========================
   🚀 GOOGLE LOGIN START
========================= */
router.get("/google", (req, res, next) => {
  console.log("🚀 /api/auth/google hit");

  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })(req, res, next);
});

/* =========================
   🔄 GOOGLE CALLBACK
========================= */
router.get(
  "/google/callback",
  (req, res, next) => {
    console.log("🔄 /api/auth/google/callback hit");
    next();
  },
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/auth`,
  }),
  async (req, res) => {
    try {
      if (!req.user) {
        console.error("⚠️ Google OAuth: req.user is null");
        return res.status(400).send("User not found after Google login");
      }

      const token = generateToken(req.user);
      console.log("✅ Google OAuth successful for user:", req.user._id);

      return res.redirect(
        `${process.env.FRONTEND_URL}/oauth-success?token=${token}`
      );
    } catch (err) {
      console.error("🔥 Google OAuth callback error:", err);
      return res.status(500).send(`Internal Server Error: ${err.message}`);
    }
  }
);

/* =========================
   📘 FACEBOOK LOGIN START
========================= */
router.get("/facebook", (req, res, next) => {
  console.log("📘 /api/auth/facebook hit");

passport.authenticate("facebook", {
  session: false,
  })(req, res, next);
});

/* =========================
   🔄 FACEBOOK CALLBACK
========================= */
router.get(
  "/facebook/callback",
  (req, res, next) => {
    console.log("🔄 /api/auth/facebook/callback hit");
    next();
  },
  passport.authenticate("facebook", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/auth`,
  }),
  async (req, res) => {
    try {
      if (!req.user) {
        console.error("⚠️ Facebook OAuth: req.user is null");
        return res.status(400).send("User not found after Facebook login");
      }

      const token = generateToken(req.user);
      console.log("✅ Facebook OAuth successful for user:", req.user._id);

      return res.redirect(
        `${process.env.FRONTEND_URL}/oauth-success?token=${token}`
      );
    } catch (err) {
      console.error("🔥 Facebook OAuth callback error:", err);
      return res.status(500).send(`Internal Server Error: ${err.message}`);
    }
  }
);

export default router;
