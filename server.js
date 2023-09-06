import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db.js";

// Routes Import
import userRoutes from "./config/user/user-route.js";
import productRoutes from "./config/product/product-route.js";
import reviewRoutes from "./config/review/review-route.js";
import orderRoutes from "./config/order/order.route.js";
import cartRoutes from "./config/cart/cart-route.js";

import cors from "cors";

//.env configuration
dotenv.config();
const app = express();
app.use(cors());

//database
connectDB();

//Cors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Expose-Headers", "accessToken, refreshToken,");
    res.header(
      "Access-Control-Allow-Methods",
      "PUT, POST, PATCH, DELETE, GET, OPTIONS"
    );
    return res.status(200).json({});
  }

  return next();
});

// To make express understand json
app.use(express.json());

// User Routes
app.use(userRoutes);

// Product Routes
app.use(productRoutes);

// Review Routes
app.use(reviewRoutes);

//Order Routes
app.use(orderRoutes);

//Cart Routes
app.use(cartRoutes);

const PORT = process.env.PORT || 9000;

app.get("/", (req, res) => {
  res.status(200).send("<h1>E-Commerce</h1>");
});

app.listen(PORT, (req, res) => {
  console.log(`SERVER IS RUNNING ON PORT ${process.env.PORT}`);
});
