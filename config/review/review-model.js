import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  reviewer: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  productId: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
  },
  review: {
    type: String,
    required: true,
    min: 2,
    max: 1000,
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
  // hasTheBuyerBoughtTheProduct: {
  //   type: Boolean,
  // },
});

export const Review = mongoose.model("Review", reviewSchema);
