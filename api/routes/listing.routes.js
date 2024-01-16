import express from "express";
import { createList } from "../controllers/listing.controller.js";
import { verfyToken } from "../utils/verfyToken.js";
const router = express.Router();

router.post('/create', verfyToken,createList)

export default router;