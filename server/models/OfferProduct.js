import mongoose from "mongoose";

const offerProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    oldPrice: { type: Number, required: true },
    newPrice: { type: Number, required: true },
    image: { type: String, required: true }, // should look like "/images/produse/filename.jpg"
    offerEndDate: { type: Date, required: true },
    conditions: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("OfferProduct", offerProductSchema);
