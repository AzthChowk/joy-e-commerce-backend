import jwt from "jsonwebtoken";
import { User } from "../config/user/user-model.js";

export const isSeller = async (req, res, next) => {
  const authToken = req?.headers?.authorization?.split(" ");
  const token = authToken[1];
  console.log(token);
  if (!token) {
    return res.status(400).send({ success: false, message: "Unauthorized." });
  }
  try {
    const userData = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
    const findUser = await User.findOne({ _id: userData._id });
    if (!findUser) {
      return res.status(400).send({ success: false, message: "Unauthorized." });
    }
    if (findUser.role !== "seller") {
      return res
        .status(400)
        .send({ success: false, message: "Unauthorized, You are not seller." });
    }
    req.userInfo = findUser;
    next();
  } catch (error) {
    return res.status(400).send({ success: false, message: "Unauthorized." });
  }
};

export const isBuyer = async (req, res, next) => {
  const authToken = req?.headers?.authorization?.split(" ");
  const token = authToken[1];
  if (!token) {
    return res.status(400).send({ success: false, message: "Unauthorized." });
  }
  try {
    const userData = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
    const findUser = await User.findOne({ _id: userData._id });
    if (!findUser) {
      return res.status(400).send({ success: false, message: "Unauthorized." });
    }
    if (findUser.role !== "buyer") {
      return res.status(400).send({ success: false, message: "Unauthorized." });
    }
    req.userInfo = findUser;
    next();
  } catch (error) {
    return res.status(400).send({ success: false, message: "Unauthorized." });
  }
};
