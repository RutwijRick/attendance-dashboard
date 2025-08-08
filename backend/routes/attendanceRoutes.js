import express from 'express';
import { verifyToken, isEmployee } from '../middlewares/authMiddleware.js';
import { checkIn, checkOut, downloadReport, getAllAttendance, getMyAttendance, updateAttendance } from '../controllers/attendanceController.js';
import { isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, isAdmin, getAllAttendance);
router.put('/:id', verifyToken, isAdmin, updateAttendance);
router.post('/checkin', verifyToken, isEmployee, checkIn);
router.post('/checkout', verifyToken, isEmployee, checkOut);
router.get('/me', verifyToken, isEmployee, getMyAttendance);
router.get('/export', verifyToken, isAdmin, downloadReport);

export default router;
