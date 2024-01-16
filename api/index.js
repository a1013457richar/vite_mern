import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/auth.routes.js";
import listingRoutes from "./routes/listing.routes.js";
import cookieParser from "cookie-parser";
dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then((db) => console.log("db is connected"))
  .catch((err) => console.log(err));

const app = express();

app.use(express.json());

app.use(cookieParser());

app.listen(3000, () => {
  console.log("server on port 3000");
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/listing", listingRoutes);

//middleware

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    error: message,
    statusCode: statusCode,
  });
});
