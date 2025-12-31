import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

/* =========================
   🔐 JWT GENERATOR
========================= */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

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
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/auth`,
  }),
  (req, res) => {
    const token = generateToken(req.user);

    res.redirect(
      `${process.env.FRONTEND_URL}/oauth-success?token=${token}`
    );
  }
);

/* =========================
   🚀 FACEBOOK LOGIN START
   (NO email scope)
========================= */
router.get(
  "/facebook",
  passport.authenticate("facebook", {
    session: false,
  })
);

/* =========================
   🔄 FACEBOOK CALLBACK
========================= */
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/auth`,
  }),
  (req, res) => {
    const token = generateToken(req.user);

    res.redirect(
      `${process.env.FRONTEND_URL}/oauth-success?token=${token}`
    );
  }
);

export default router;
