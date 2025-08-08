import express from 'express';
import { verifyToken, isAdmin, isEmployee } from '../middlewares/authMiddleware.js';
import { login } from '../controllers/authController.js';

const router = express.Router();


router.post('/login', login);

router.get('/admin-only', verifyToken, isAdmin, (req, res) => {
    res.json({ message: 'Hello Admin!' });
});

router.get('/employee-only', verifyToken, isEmployee, (req, res) => {
    res.json({ message: 'Hello Employee!' });
});

router.get('/profile', verifyToken, (req, res) => {
    res.json({ message: 'Hello User!', user: req.user });
});


export default router;
