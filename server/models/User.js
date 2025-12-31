import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    /* =========================
       AUTH
    ========================= */
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      select: false, // 🔐 never return password by default
      default: null, // ✅ allow OAuth users without password
    },

    provider: {
      type: String,
      enum: ["local", "google", "facebook"],
      default: "local",
    },

    googleId: {
      type: String,
      default: null,
    },

    facebookId: {
      type: String,
      default: null,
    },

    role: {
      type: String,
      enum: ["client", "admin"],
      default: "client",
    },

    /* =========================
       ACCOUNT TYPE (B2C / B2B)
    ========================= */
    accountType: {
      type: String,
      enum: ["individual", "company"],
      default: "individual",
    },

    /* =========================
       CONTACT INFORMATION
    ========================= */
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    /* =========================
       SHIPPING ADDRESS
    ========================= */
    shippingAddress: {
      country: { type: String, default: "" },
      city: { type: String, default: "" },
      addressLine: { type: String, default: "" },
      postalCode: { type: String, default: "" },
    },

    /* =========================
       COMPANY / B2B PROFILE
    ========================= */
    company: {
      companyName: { type: String, default: "" },
      vatNumber: { type: String, default: "" },

      email: {
        type: String,
        trim: true,
        lowercase: true,
        default: "",
      },

      phone: {
        type: String,
        trim: true,
        default: "",
      },

      invoiceAddress: {
        country: { type: String, default: "" },
        city: { type: String, default: "" },
        addressLine: { type: String, default: "" },
        postalCode: { type: String, default: "" },
      },
    },
  },
  { timestamps: true }
);

/* =========================
   🔐 HASH PASSWORD (LOCAL ONLY)
========================= */
userSchema.pre("save", async function (next) {
  // ✅ Skip hashing if password is missing (OAuth users)
  if (!this.password) return next();

  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/* =========================
   🔑 PASSWORD COMPARE
========================= */
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
