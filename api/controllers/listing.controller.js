import Listing from "../models/Listing.model.js";
export const createList = async (req, res, next) => {
  const listing = await Listing.create(req.body);
  res.status(201).json(listing);
  try {
    await newListing.save();
    res.status(201).json({
      message: "Listing created successfully!",
    });
  } catch (error) {
    next(error);
  }
};
//     }
