import express from "express";
import { createListing } from "../controllers/listing.controller.js";
import { deleteListing } from "../controllers/listing.controller.js";
import { updateListing } from "../controllers/listing.controller.js";
import { getListing } from "../controllers/listing.controller.js";
import { verfyToken } from "../utils/verfyToken.js";
const router = express.Router();

router.post('/create', verfyToken,createListing)
router.delete('/delete/:id', verfyToken,deleteListing)
router.post('/update/:id', verfyToken,updateListing)
router.get('/get/:id',getListing)


export default router;