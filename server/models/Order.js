import mongoose from "mongoose";

/* ============================
   Order Item Snapshot
============================ */
const orderItemSchema = new mongoose.Schema(
  {
    // 🔗 Link to Product (CRITICAL for barcodes, stock, etc.)
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    // 🧾 Snapshot fields (never change after order)
    name: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    unitPrice: {
      type: Number,
      required: true, // price per unit at order time
    },

    unitsPerBox: {
      type: Number,
      default: 1,
    },

    boxes: {
      type: Number,
      required: true,
      min: 0,
    },

    pallets: {
      type: Number,
      default: 0,
      min: 0,
    },

    lineTotal: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

/* ============================
   Order Schema
============================ */
const orderSchema = new mongoose.Schema(
  {
    /* ------------------------
       Order number
    ------------------------ */
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },

    /* ------------------------
       User reference
    ------------------------ */
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /* ------------------------
       Customer type
    ------------------------ */
    customerType: {
      type: String,
      enum: ["individual", "company"],
      required: true,
    },

    /* ------------------------
       Customer snapshot
    ------------------------ */
    customer: {
      fullName: {
        type: String,
        required: function () {
          return this.customerType === "individual";
        },
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
    },

    /* ------------------------
       Company details (B2B)
    ------------------------ */
    company: {
      companyName: {
        type: String,
        default: "",
      },
      vatNumber: {
        type: String,
        default: "",
      },
      contactPerson: {
        type: String,
        default: "",
      },
    },

    /* ------------------------
       Shipping address
    ------------------------ */
    shippingAddress: {
      country: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      addressLine: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
    },

    /* ------------------------
       Order items
    ------------------------ */
    items: {
      type: [orderItemSchema],
      required: true,
      validate: [(v) => v.length > 0, "Order must have at least one item"],
    },

    /* ------------------------
       Pricing
    ------------------------ */
    currency: {
      type: String,
      enum: ["RON", "EUR"],
      default: "RON",
    },

    subtotal: {
      type: Number,
      required: true,
    },

    shipping: {
      type: Number,
      default: 0,
    },

    total: {
      type: Number,
      required: true,
    },

    /* ------------------------
       Payment
    ------------------------ */
    paymentMethod: {
      type: String,
      enum: ["REVOLUT", "PAYPAL", "IBAN_RON", "IBAN_EUR", "WU"],
      required: true,
    },

    status: {
      type: String,
      enum: [
        "created",
        "pending_payment",
        "paid",
        "cancelled",
        "shipped",
        "completed",
      ],
      default: "created",
    },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "pending", "paid", "failed"],
      default: "unpaid",
    },

    /* ------------------------
       Payment provider data
    ------------------------ */
    provider: {
      type: String,
      default: "",
    },

    providerRef: {
      type: String,
      default: "",
    },

    /* ------------------------
       Optional notes
    ------------------------ */
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

/* ============================
   Auto-generate order number
============================ */
orderSchema.pre("validate", function (next) {
  if (this.orderNumber) return next();

  const year = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);

  this.orderNumber = `ZD-${year}-${random}`;
  next();
});

export default mongoose.model("Order", orderSchema);
