import express from "express";
import { isBuyer } from "../../authorization/authorization-middleware.js";

const router = express.Router();

// post the order

router.post("/product/order/:id", isBuyer, (req, res) => {
  const productId = req.params.id;
  const productDetails = req.body;
  return res.status(201).send("Order post....");
});

export default router;
