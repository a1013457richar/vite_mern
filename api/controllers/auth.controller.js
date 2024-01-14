import User from "../models/UserModel.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
export const signup = async (req, res, next) => {
  //   console.log(req.body);
  const { username, email, password } = req.body;
  const hashPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashPassword });
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

export const signin = async (req, res, next) => {
  //   console.log(req.body);
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });
    
    if (!validUser) {
      return next(errorHandler(404, "Email not found!"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Password not correct!"));
    }
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    const { password: userPassword, ...rest } = validUser._doc;
    res
      .cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    
    const user = await User.findOne({ email: req.body.email });
    
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      
      const { password: userPassword, ...rest } = user._doc;
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
      res.cookie("access_token", token, {
        httpOnly: true,
        expires,
      }).status(200).json(rest);
    } else {
      const generatePassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
        console.log(req.body.name);
      const hashPassword = bcryptjs.hashSync(generatePassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-8),
        email: req.body.email,
        password: hashPassword,
        profilePic: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      const { password: userPassword, ...rest } = user._doc;
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
      res.cookie("access_token", token, {
        httpOnly: true,
        expires,
      }).status(200).json(rest);
    }
  } catch (error) {
    next(error);
  }
};
