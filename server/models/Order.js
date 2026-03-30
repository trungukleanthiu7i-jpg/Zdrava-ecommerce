import mongoose from "mongoose";

/* ============================
   Order Item Snapshot
============================ */
const orderItemSchema = new mongoose.Schema(
  {
    // 🔗 Link to Product
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    // 🧾 Snapshot fields
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
      min: 1,
    },

    boxPerPalet: {
      type: Number,
      default: 0,
      min: 0,
    },

    pieces: {
      type: Number,
      default: 0,
      min: 0,
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
   Oblio Invoice Snapshot
============================ */
const oblioInvoiceSchema = new mongoose.Schema(
  {
    issued: {
      type: Boolean,
      default: false,
    },
    invoiceId: {
      type: String,
      default: "",
    },
    seriesName: {
      type: String,
      default: "",
    },
    number: {
      type: String,
      default: "",
    },
    link: {
      type: String,
      default: "",
    },
    einvoice: {
      type: String,
      default: "",
    },
    total: {
      type: Number,
      default: 0,
    },
    issuedAt: {
      type: Date,
      default: null,
    },
    error: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

/* ============================
   Order Schema
============================ */
const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    customerType: {
      type: String,
      enum: ["individual", "company"],
      required: true,
    },

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

    items: {
      type: [orderItemSchema],
      required: true,
      validate: [(v) => v.length > 0, "Order must have at least one item"],
    },

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

    paymentMethod: {
      type: String,
      enum: ["NETOPIA", "REVOLUT", "PAYPAL", "IBAN_RON", "IBAN_EUR", "WU"],
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

    provider: {
      type: String,
      default: "",
    },

    providerRef: {
      type: String,
      default: "",
    },

    oblioInvoice: {
      type: oblioInvoiceSchema,
      default: () => ({}),
    },

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