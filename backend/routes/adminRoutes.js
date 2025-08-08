import express from 'express';
import { isAdmin, verifyToken } from '../middlewares/authMiddleware.js';
import Settings from '../models/Settings.js';

const router = express.Router();

router.put('/settings/notification-timer', verifyToken, isAdmin, async (req, res) => {
    const { value } = req.body;
    await Settings.upsert({ key: 'notificationTimer', value });
    res.json({ message: 'Timer updated' });
});

export default router;