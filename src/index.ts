import express from "express";
import mongoose from "mongoose";
import { connectDB } from "./config/database";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";
import authRoutes from "./routes/authRoutes";
import morgan from "morgan";

dotenv.config();

// const startServer = async (): Promise<void> => {
//   try {
//     await connectDB();
//   } catch (error) {
//     console.error("Error starting the server:", error);
//     process.exit(1);
//   }
// };

// startServer();

const app = express();
app.use(express.json());
app.use(morgan("dev"));

const port = 3000;

// app.get("/", (req, res) => {
//   res.status(200).json({ message: "Hello, World!" });
// });

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("api/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

connectDB().catch((error) => {
  console.log(error);
});
