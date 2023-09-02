import mongoose from "mongoose";
import { Product } from "./product-model.js";

//check whether the input id is mongoId or not?
export const checkMongoId = async (req, res, next) => {
  const inputId = req.params.id;
  //check if the input id is valid mongoid or not?
  const checkIfInputIdIsMongoIdOrNot = mongoose.Types.ObjectId.isValid(inputId);
  //if not, terminate and display the message.
  if (!checkIfInputIdIsMongoIdOrNot) {
    return res.status(400).send({
      success: false,
      message: "Invalid MongoID.",
    });
  }
  next();
};

//find the product in the database
export const findProduct = async (req, res, next) => {
  const inputId = req.params.id;
  //if yes, proceed for delete.
  const findProductId = await Product.findOne({ _id: inputId });
  if (!findProductId) {
    return res.status(400).send({
      success: false,
      message: "The product with the given id does not exist.",
    });
  }
  req.foundProduct = findProductId;
  next();
};
//check whether the user is actual seller of that product or not?
export const checkProductSeller = async (req, res, next) => {
  const product = req.foundProduct;
  const loggedInUserId = req.userInfo._id;
  const isProductActualSeller = loggedInUserId.equals(product.sellerId);
  if (!isProductActualSeller) {
    return res.status(403).send({
      success: false,
      message: "You are forbidden to do this operation.",
    });
  }
  next();
};

//delete the product
export const deleteProduct = async (req, res) => {
  const deleteId = req.params.id;
  try {
    await Product.deleteOne({ _id: deleteId });
    return res.status(200).send("Deleted successfully.");
  } catch (error) {
    return res.status(400).send({ success: false, message: "Cannot delete." });
  }
};
