import Joi from "joi";

export const validateInputFromUserSchema = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().required(),
});
