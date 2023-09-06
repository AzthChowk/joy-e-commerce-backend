import express from "express";
import { checkIfInputIdIsMongoIdOrNot } from "../../utils/utils.js";
import { Product } from "../product/product-model.js";
import { isBuyer } from "../../authorization/authorization-middleware.js";
import { Cart } from "./cart-model.js";
import { validateInputFromUserSchema } from "./cart-validation.js";

const router = express.Router();

// ============ create cart =======================
router.post("/cart/add/product", isBuyer, async (req, res) => {
  const { productId, quantity } = req.body;
  //validate the input data from user - Joi
  try {
    const validatedInput = await validateInputFromUserSchema.validateAsync({
      productId,
      quantity,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message,
    });
  }

  // Check whether the MongoId is valid or not
  const checkMongoIdValidation = checkIfInputIdIsMongoIdOrNot(
    req.body.productId
  );

  // If the MongoId is not valid, throw error
  if (!checkMongoIdValidation) {
    return res
      .status(400)
      .send({ success: false, message: "The given id is not valid mongoId" });
  }

  // If the MongoId is valid, Find the product
  const product = await Product.findOne({ _id: req.body.productId });

  // If no product, throw error
  if (!product) {
    return res
      .status(400)
      .send({ success: false, message: "Product not found." });
  }

  // get the userid from the isBuyer (middleware)
  const buyerId = req.userInfo._id;

  // check the quantity - if the quantity is less than the ordered quantity or the quantity is zero , throw error
  if (quantity > product.quantity) {
    return res.status(403).send({
      success: false,
      message: "The product is out of stock at the moment.",
    });
  }

  // find the matching product - when buyer add the same product again - it should increase the quantity rather than creating a new array.
  const matchingProduct = await Cart.findOne({
    _id: buyerId,
    "productList.productId": productId,
  });
  if (matchingProduct) {
    await Cart.updateOne(
      {
        buyerId: buyerId,
      },
      {
        $inc: {
          "productList.$[].quantity": quantity,
        },
      }
    );
    return res.status(200).send({
      success: true,
      message: "Item is added to the cart successfully.",
    });
  }

  // Update a cart, if there is no cart than - create (upsert)
  await Cart.updateOne(
    {
      buyerId: buyerId,
    },
    {
      $push: {
        productList: { productId, quantity },
      },
    },
    {
      upsert: true,
    }
  );

  //return message
  return res.status(200).send({
    success: true,
    message: "Item is added to the cart successfully.",
  });
});

export default router;
