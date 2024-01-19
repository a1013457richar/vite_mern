import express from 'express';
import { updatedUser } from '../controllers/user.controller.js';
import { deleteUser } from '../controllers/user.controller.js';
import { getUser } from '../controllers/user.controller.js';
import { getUserProfile } from '../controllers/user.controller.js';
import { verfyToken } from '../utils/verfyToken.js';

const router = express.Router();



router.post('/update/:id',verfyToken,updatedUser)
router.delete('/delete/:id',verfyToken,deleteUser)
router.get('/listing/:id',verfyToken,getUser)
router.get('/:id',verfyToken,getUserProfile)



export default router;
