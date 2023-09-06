import mongoose from "mongoose";

// set rule
const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    minlength: 2,
    maxlength: 55,
    trim: true,
    required: true,
  },
  category: {
    type: String,
    enum: [
      "New Arrivals",
      "Mens",
      "Women",
      "Accessories",
      "Bag Packs",
      "Shoes",
      "Sale",
    ],
    trim: true,
    required: true,
  },
  section: {
    type: String,
    enum: [
      "Shoes and Socks",
      "Pants",
      "Jackets and Outer",
      "Shirts",
      "T-shirts",
      "Belts",
      "Inner-wears",
      "Bags",
      "Others",
    ],
    trim: true,
    required: true,
  },
  brand: {
    type: String,
    minlength: 2,
    maxlength: 55,
    trim: true,
    required: true,
  },
  color: {
    type: String,
    minlength: 2,
    maxlength: 55,
    trim: true,
  },
  size: {
    type: String,
    minlength: 1,
    maxlength: 10,
    trim: true,
  },
  quantity: {
    type: Number,
    min: 1,
    required: true,
  },
  inStock: {
    type: Boolean,
    default: false,
  },
  regularPrice: {
    type: Number,
    min: 1,
    required: true,
  },
  salePrice: {
    type: Number,
    min: 1,
    required: true,
  },
  onSale: {
    type: Boolean,
    default: false,
  },
  freeShipping: {
    type: Boolean,
    default: false,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  addDate: {
    type: Date,
    default: Date.now(),
  },
});

// create table
export const Product = mongoose.model("Product", productSchema);
