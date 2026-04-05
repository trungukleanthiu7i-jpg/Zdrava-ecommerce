import express from "express";
import User from "../models/User.js";
import PendingUser from "../models/PendingUser.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import { sendEmail } from "../utils/sendEmail.js";

const router = express.Router();

console.log("✅ userRoutes FILE LOADED");

function isStrongPassword(password = "") {
  const minLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  return minLength && hasUppercase && hasNumber;
}

function isValidEmail(email = "") {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const passwordRuleMessage =
  "Password must contain at least 6 characters, one uppercase letter and one number.";

/* =============================
   🔎 TEST ROUTE
============================= */
router.get("/ping", (req, res) => {
  res.send("USERS ROUTES OK");
});

/* =============================
   ✅ GET CURRENT USER
============================= */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    console.error("❌ GET /me error:", err);
    res.status(500).json({ message: "Failed to fetch profile." });
  }
});

/* =============================
   ✏️ UPDATE PROFILE (B2C + B2B)
============================= */
router.put("/me", authMiddleware, async (req, res) => {
  try {
    const { email, phone, accountType, shippingAddress, company } = req.body;

    const updates = {};

    if (email !== undefined) {
      const normalizedEmail = String(email).trim().toLowerCase();

      if (normalizedEmail && !isValidEmail(normalizedEmail)) {
        return res.status(400).json({ message: "Invalid email format." });
      }

      updates.email = normalizedEmail;
      updates.username = normalizedEmail;
    }

    if (phone !== undefined) updates.phone = phone;
    if (accountType !== undefined) updates.accountType = accountType;

    if (shippingAddress) {
      if (shippingAddress.country !== undefined)
        updates["shippingAddress.country"] = shippingAddress.country;
      if (shippingAddress.city !== undefined)
        updates["shippingAddress.city"] = shippingAddress.city;
      if (shippingAddress.addressLine !== undefined)
        updates["shippingAddress.addressLine"] = shippingAddress.addressLine;
      if (shippingAddress.postalCode !== undefined)
        updates["shippingAddress.postalCode"] = shippingAddress.postalCode;
    }

    if (company) {
      if (company.companyName !== undefined)
        updates["company.companyName"] = company.companyName;
      if (company.vatNumber !== undefined)
        updates["company.vatNumber"] = company.vatNumber;

      if (company.email !== undefined) {
        const normalizedCompanyEmail = String(company.email)
          .trim()
          .toLowerCase();

        if (normalizedCompanyEmail && !isValidEmail(normalizedCompanyEmail)) {
          return res
            .status(400)
            .json({ message: "Invalid company email format." });
        }

        updates["company.email"] = normalizedCompanyEmail;
      }

      if (company.phone !== undefined) updates["company.phone"] = company.phone;

      if (company.invoiceAddress) {
        if (company.invoiceAddress.country !== undefined)
          updates["company.invoiceAddress.country"] =
            company.invoiceAddress.country;
        if (company.invoiceAddress.city !== undefined)
          updates["company.invoiceAddress.city"] =
            company.invoiceAddress.city;
        if (company.invoiceAddress.addressLine !== undefined)
          updates["company.invoiceAddress.addressLine"] =
            company.invoiceAddress.addressLine;
        if (company.invoiceAddress.postalCode !== undefined)
          updates["company.invoiceAddress.postalCode"] =
            company.invoiceAddress.postalCode;
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields to update." });
    }

    if (updates.email) {
      const existingUser = await User.findOne({
        _id: { $ne: req.user._id },
        $or: [{ email: updates.email }, { username: updates.username }],
      });

      if (existingUser) {
        return res.status(400).json({ message: "Email already in use." });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    res.json(user);
  } catch (err) {
    console.error("❌ PUT /me error:", err);
    res.status(500).json({ message: err.message });
  }
});

/* =============================
   🔐 CHANGE PASSWORD
============================= */
router.put("/me/password", authMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Old password and new password are required." });
    }

    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({ message: passwordRuleMessage });
    }

    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect." });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully." });
  } catch (err) {
    console.error("❌ CHANGE PASSWORD error:", err);
    res.status(500).json({ message: "Failed to change password." });
  }
});

/* =============================
   ✅ REGISTER
   TEMPORARY DIRECT ACCOUNT CREATION
============================= */
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "All fields required." });
    }

    const normalizedEmail = String(username).trim().toLowerCase();

    if (!isValidEmail(normalizedEmail)) {
      return res
        .status(400)
        .json({ message: "Please enter a valid email address." });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({ message: passwordRuleMessage });
    }

    const existingUser = await User.findOne({
      $or: [{ username: normalizedEmail }, { email: normalizedEmail }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "An account with this email already exists." });
    }

    const existingPendingUser = await PendingUser.findOne({
      email: normalizedEmail,
    });

    if (existingPendingUser) {
      await PendingUser.deleteMany({ email: normalizedEmail });
    }

    const user = await User.create({
      username: normalizedEmail,
      email: normalizedEmail,
      password,
    });

    try {
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

      await sendEmail({
        to: normalizedEmail,
        subject: "Welcome to Albania Product",
        text: `Your account was created successfully. You can now log in at ${frontendUrl}/auth`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Welcome to Albania Product</h2>
            <p>Your account was created successfully.</p>
            <p>You can now log in using your email and password.</p>
            <p>
              <a
                href="${frontendUrl}/auth"
                style="display:inline-block;padding:12px 20px;background:#111;color:#fff;text-decoration:none;border-radius:8px;"
              >
                Log In
              </a>
            </p>
          </div>
        `,
      });
    } catch (mailError) {
      console.error("⚠️ Welcome email failed, but account was created:", mailError.message);
    }

    return res.status(201).json({
      message: "Account created successfully. You can now log in.",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        accountType: user.accountType,
      },
    });
  } catch (err) {
    console.error("❌ Register error:", err);
    res.status(500).json({ message: err.message || "Registration failed." });
  }
});

/* =============================
   ✅ LOGIN (CLIENT + ADMIN)
============================= */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const normalizedEmail = String(username || "").trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await User.findOne({
      $or: [{ username: normalizedEmail }, { email: normalizedEmail }],
    }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        accountType: user.accountType,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Login failed." });
  }
});

/* =============================
   ⚠️ ADMIN — GET ALL USERS
============================= */
router.get("/", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied." });
  }

  const users = await User.find().select("-password");
  res.json(users);
});

export default router;