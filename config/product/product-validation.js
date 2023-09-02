import Joi from "joi";

export const newProductValidation = Joi.object({
  productName: Joi.string().max(55).required("Product name is required."),
  brand: Joi.string().max(55).required("Brand name is required."),
  regularPrice: Joi.number()
    .integer()
    .positive("Price must be positive.")
    .min(1, "Price is required.")
    .required("Price is required."),
  isOnSale: Joi.boolean(),
  salePrice: Joi.number()
    .integer()
    .positive("Price must be positive.")
    .min(1, "Price must be at least more than zero."),
  quantity: Joi.number()
    .min(1)
    .integer()
    .positive("The quantity must be greater than zero.")
    .required("Quantity is required."),
  freeShipping: Joi.boolean(),
  inStock: Joi.boolean().required("In stock value is required."),
  color: Joi.string(),
  size: Joi.string(),
  category: Joi.string().required("Category is required."),
  section: Joi.string().required("Section is required."),
  imageUrl: Joi.string().required("Image is required."),
  description: Joi.string(),
});
