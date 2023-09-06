import express from "express";
import mongoose from "mongoose";

import { Review } from "./review-model.js";
import { checkMongoId } from "../../utils/utils.js";
import { findProduct } from "../product/product-service.js";
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
router.post("/product/reviews", isBuyer, async (req, res) => {
  try {
    const usersReviewsList = await Review.aggregate([
      {
        $match: { reviewer: req.userInfo._id },
      },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "userReviewLookupResult",
        },
      },
      {
        $project: {
          productId: { $first: "$userReviewLookupResult._id" },
          productName: { $first: "$userReviewLookupResult.productName" },
          productImage: { $first: "$userReviewLookupResult.imageUrl" },
          review: 1,
          date: 1,
        },
      },
    ]);
    return res.status(200).send(usersReviewsList);
  } catch (error) {
    return res.status(400).send({ success: false, message: error.message });
  }
});

// Get Reviews for specific product
router.get(
  "/product/reviews/:id",
  checkMongoId,
  findProduct,
  async (req, res) => {
    const productIdOfReviewsToFind = req.foundProduct;
    try {
      const reviewsOfProduct = await Review.aggregate([
        {
          $match: {
            productId: productIdOfReviewsToFind._id,
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "productLookupResult",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "reviewer",
            foreignField: "_id",
            as: "userLookupResult",
          },
        },
        {
          $project: {
            _id: 1,
            productId: { $first: "$productLookupResult._id" },
            productName: { $first: "$productLookupResult.productName" },
            reviewerFName: { $first: "$userLookupResult.firstName" },
            reviewerLName: { $first: "$userLookupResult.lastName" },
            review: 1,
            date: 1,
            rating: 1,
          },
        },
      ]);
      console.log(reviewsOfProduct);
      return res.status(200).send(reviewsOfProduct);
    } catch (error) {
      return res.status(400).send({ success: false, message: error.message });
    }
  }
);

export default router;
