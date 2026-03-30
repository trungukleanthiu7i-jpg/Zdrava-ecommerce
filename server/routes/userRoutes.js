import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

console.log("✅ userRoutes FILE LOADED");

function isStrongPassword(password = "") {
  const minLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  return minLength && hasUppercase && hasNumber;
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

    if (email !== undefined) updates.email = email;
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
      if (company.email !== undefined)
        updates["company.email"] = company.email;
      if (company.phone !== undefined)
        updates["company.phone"] = company.phone;

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
   ✅ REGISTER (CLIENT ONLY)
============================= */
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "All fields required." });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({ message: passwordRuleMessage });
    }

    const exists = await User.findOne({ username });
    if (exists) {
      return res.status(400).json({ message: "Username already exists." });
    }

    const user = await User.create({
      username,
      password,
      role: "client",
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        role: user.role,
        accountType: user.accountType,
      },
    });
  } catch (err) {
    console.error("❌ Register error:", err);
    res.status(500).json({ message: "Registration failed." });
  }
});

/* =============================
   ✅ LOGIN (CLIENT + ADMIN)
============================= */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username }).select("+password");
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