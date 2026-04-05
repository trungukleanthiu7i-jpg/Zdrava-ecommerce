import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      select: false,
      default: null,
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

    accountType: {
      type: String,
      enum: ["individual", "company"],
      default: "individual",
    },

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

    shippingAddress: {
      country: { type: String, default: "" },
      city: { type: String, default: "" },
      addressLine: { type: String, default: "" },
      postalCode: { type: String, default: "" },
    },

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

userSchema.pre("save", async function (next) {
  if (!this.password) return next();
  if (!this.isModified("password")) return next();

  // already hashed bcrypt password from PendingUser
  if (String(this.password).startsWith("$2a$") ||
      String(this.password).startsWith("$2b$") ||
      String(this.password).startsWith("$2y$")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);