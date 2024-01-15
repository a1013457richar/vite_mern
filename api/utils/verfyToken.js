import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";

export const verfyToken = (req, res, next) => {
  console.log(req.cookies.token);
  const token = req.cookies.token;
  console.log("🚀 ~ verfyToken ~ token:", token)

  if (!token) {
    return next(errorHandler(401, "Not Authorized"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(errorHandler(403, "Forbidden"));
    }
    //save the id of the user to the req object
    req.user = user;
  });
//go to the updatedUser function in the user.controller.js
  next();
};
