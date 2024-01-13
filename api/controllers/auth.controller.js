import User from "../models/UserModel.js";
import bcryptjs from "bcryptjs";
export const signup = async (req, res) => {
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
    res.status(500).json({
      message: error.message || "Something went wrong!",
    });
  }
};
