import express from "express";
import Joi from "joi";
import { isSeller } from "../../authorization/authorization-middleware.js";
import { Product } from "./product-model.js";
import {
  checkMongoId,
  checkProductSeller,
  deleteProduct,
  findProduct,
} from "./product-service.js";
import { newProductValidation } from "./product-validation.js";

const router = express.Router();

//Add product
router.post("/product/add", isSeller, async (req, res) => {
  const newProduct = req.body;
  console.log(newProduct);
  try {
    const validatedProduct = await newProductValidation.validateAsync(
      newProduct
    );
    validatedProduct.sellerId = req.userInfo._id;
    await Product.create(validatedProduct);
    console.log("new product added successfully.");
    return res
      .status(201)
      .send({ success: true, message: "NEW PRODUCT ADDED SUCCESSFULLY." });
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

//get all products

router.get("/products", async (req, res) => {
  const productList = await Product.find({});
  res.status(200).send(productList);
});

//get a product details - Guest / Buyer

router.get("/product/details/:id", checkMongoId, async (req, res) => {
  const productId = req.params.id;
  const productDetails = await Product.findOne({ _id: productId });
  if (!productDetails) {
    return res
      .status(404)
      .send({ success: false, message: "Product not found." });
  }
  return res.status(200).send(productDetails);
});

//get all products of seller
router.get("/products/seller/all", isSeller, async (req, res) => {
  //get the seller id from the authorization middleware, which is in the form of Bearer key.
  const skip = (req.body.page - 1) * req.body.limit;
  console.log(skip);
  const sellerIdFromAuthorizationMiddleware = req.userInfo._id;
  try {
    const sellerProductList = await Product.aggregate([
      {
        $match: {
          // match those products only whose sellerId is the logged seller.
          sellerId: sellerIdFromAuthorizationMiddleware,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: req.body.limit,
      },
    ]);
    return res.status(200).send(sellerProductList);
  } catch (error) {
    return res.status(400).send("Error on getting the data.");
  }
});

//get On sale products
router.get("/products/sale", async (req, res) => {
  try {
    const onSaleProducts = await Product.aggregate([
      {
        $match: {
          onSale: true,
        },
      },
      {
        $limit: 5,
      },
    ]);
    return res.status(200).send(onSaleProducts);
  } catch (error) {
    return res.status(400).send("Error on getting the data.");
  }
});

//get new arrivals products
router.get("/products/newarrivals", async (req, res) => {
  try {
    const onSaleProducts = await Product.aggregate([
      {
        $match: {
          category: "New Arrivals",
        },
      },
      {
        $limit: 5,
      },
    ]);
    return res.status(200).send(onSaleProducts);
  } catch (error) {
    return res.status(400).send("Error on getting the data.");
  }
});

//get product detail of seller
router.post(
  "/products/seller/view/:id",
  isSeller,
  checkMongoId,
  async (req, res) => {
    //get the seller id from the authorization middleware, which is in the form of Bearer key.
    const productViewId = req.params.id;
    const productDetails = await Product.findOne({ _id: productViewId });
    if (!productDetails) {
      return res
        .status(404)
        .send({ success: false, message: "Product not found." });
    }
    return res.status(200).send(productDetails);
  }
);

// delete product
router.delete(
  "/product/delete/:id",
  checkMongoId,
  findProduct,
  // isSeller,
  // checkProductSeller,
  deleteProduct
);

export default router;
