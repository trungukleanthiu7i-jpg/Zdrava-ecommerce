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
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

/* =========================
   🔄 GOOGLE CALLBACK
========================= */
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: `${process.env.FRONTEND_URL}/auth` }),
  async (req, res) => {
    try {
      if (!req.user) {
        console.error("⚠️ Google OAuth: req.user is null");
        return res.status(400).send("User not found after Google login");
      }

      const token = generateToken(req.user);
      console.log("✅ Google OAuth successful, token generated:", token);

      // Redirect to frontend with token
      res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}`);
    } catch (err) {
      console.error("🔥 OAuth callback error:", err);
      res.status(500).send(`Internal Server Error: ${err.message}`);
    }
  }
);

export default router;
