import express from "express";
import mongoose from "mongoose";

import { Review } from "./review-model.js";
import { checkMongoId, findProduct } from "../product/product-service.js";
import { isBuyer } from "../../authorization/authorization-middleware.js";

const router = express.Router();

// Add review
router.post(
  "/product/review/:id",
  checkMongoId,
  findProduct,
  isBuyer,
  async (req, res) => {
    const newReview = req.body;
    const product = req.foundProduct;

    try {
      await Review.create(newReview);
      return res.status(201).send({ success: true, message: "Review added." });
    } catch (error) {
      return res.status(400).send({ success: false, message: error.message });
    }
  }
);

// Get Reviews
router.get("/product/reviews", async (req, res) => {
  try {
    const reviewsList = await Review.find({});
    return res.status(200).send(reviewsList);
  } catch (error) {
    return res.status(400).send({ success: false, message: error.message });
  }
});

export default router;
