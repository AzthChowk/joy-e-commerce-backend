import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log({
      success: true,
      message: "DATABASE CONNECTION SUCCESSFUL.",
    });
  } catch (error) {
    console.log({
      success: false,
      message: "SORRY, DATABASE CONNECTION FAILED.",
    });
  }
};
