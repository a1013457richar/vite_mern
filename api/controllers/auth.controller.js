import User from "../models/UserModel.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
export const signup = async (req, res,next) => {
  //   console.log(req.body);
  const { username, email, password } = req.body;
  const hashPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password:hashPassword });
  //這裡要加await
  try {
    await newUser.save();
    res.status(201).json({
      message: "User signup successfully!",
    });
  } catch (error) {
    next(error);
  }
};
