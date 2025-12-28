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
      required: true,
      select: false, // 🔐 never return password by default
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
       (used only if accountType === "company")
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

      /* =========================
         INVOICE ADDRESS
      ========================= */
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
   🔐 HASH PASSWORD
========================= */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/* =========================
   🔑 PASSWORD COMPARE
========================= */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
