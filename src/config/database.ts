import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env["MONGODB_URI"];

    if (!mongoURI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    await mongoose.connect(mongoURI);
    console.log("Kết nối thành công với MongoDB");

    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      process.exit(0);
    });
  } catch (error) {
    throw new Error(`Error connecting to mongoDB: ${error}`);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
  } catch (error) {}
};
