import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  orderedProduct: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
  },
  orderedQty: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
  },
  orderDate: {
    type: Date,
    default: Date.now(),
  },
});

export const Order = mongoose.model("Order", orderSchema);
