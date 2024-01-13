import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/auth.routes.js"
dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then((db) => console.log("db is connected"))
  .catch((err) => console.log(err));

const app = express();

app.use(express.json());

app.listen(3000, () => {
  console.log("server on port 3000");
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
