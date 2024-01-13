import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then((db) => console.log("db is connected"))
  .catch((err) => console.log(err));

const app = express();

app.listen(3000, () => {
  console.log("server on port 3000");
});
