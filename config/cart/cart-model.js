import mongoose from "mongoose";

const productsToAddOnCartSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const cartSchema = new mongoose.Schema({
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  productList: {
    type: [productsToAddOnCartSchema],
  },
});

export const Cart = mongoose.model("Cart", cartSchema);
