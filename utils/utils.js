import mongoose from "mongoose";

//check whether the input id is mongoId or not?

export const checkMongoId = async (req, res, next) => {
  const inputId = req.params.id;
  //check if the input id is valid mongoid or not?
  const checkIfInputIdIsMongoIdOrNot = mongoose.Types.ObjectId.isValid(inputId);
  //if not, terminate and display the message.
  if (!checkIfInputIdIsMongoIdOrNot) {
    return res.status(400).send({
      success: false,
      message: "The given id is not valid MongoId.",
    });
  }
  next();
};
