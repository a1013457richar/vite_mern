import express from "express";
import { createListing } from "../controllers/listing.controller.js";
import { verfyToken } from "../utils/verfyToken.js";
const router = express.Router();

router.post('/create', verfyToken,createListing)

export default router;