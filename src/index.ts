import express from "express";
import mongoose from "mongoose";
import { connectDB } from "./config/database";

const startServer = async (): Promise<void> => {
  try {
    await connectDB();
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }
};

startServer();

const app = express();

const port = 3000;

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello, World!" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
