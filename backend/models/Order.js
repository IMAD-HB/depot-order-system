import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, "Le nom du client est requis"],
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    items: [
      {
        productName: {
          type: String,
          required: [true, "Le nom du produit est requis"],
        },
        quantity: {
          type: Number,
          required: [true, "La quantité est requise"],
          min: [1, "La quantité doit être au moins 1"],
        },
      },
    ],
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
