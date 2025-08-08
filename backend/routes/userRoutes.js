import express from 'express';
import { verifyToken, isAdmin, isEmployee } from '../middlewares/authMiddleware.js';
import { registerUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', verifyToken, isAdmin, registerUser);

export default router;