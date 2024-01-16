import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import User from "../models/UserModel.js";
import Listing from "../models/Listing.model.js";

export const test = (req, res) => {
  res.json({ message: "Hello World" });
};

export const updatedUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can only update your own account"));
  }
  try {
    //hash the password
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    //update the user
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          profilePic: req.body.profilePic,
        },
      },
      { new: true }
    );
    const { password, ...others } = updateUser._doc;

    res.status(200).json(others);
  } catch (err) {
    return next(errorHandler(500, "Internal Server Error"));
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can only delete your own account"));
  }
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json({ message: "User has been deleted" });
  } catch (err) {
    return next(errorHandler(500, "Internal Server Error"));
  }
};

export const getUser = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      const listing = await Listing.find({ userRef: req.params.id });
      return res.status(200).json(listing); //return the listing
    } catch (error) {
      next(error);
    }
  } else {
    return res(errorHandler(401, "You can only get your own account"));
  }
};
