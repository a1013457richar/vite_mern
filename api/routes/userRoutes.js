import express from 'express';
import { updatedUser } from '../controllers/user.controller.js';
import { verfyToken } from '../utils/verfyToken.js';

const router = express.Router();



router.post('/update/:id',verfyToken,updatedUser)

export default router;
