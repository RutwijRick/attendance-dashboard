import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, role }
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token." });
    }
};

export const isAdmin = (req, res, next) => {
    if (req.user.role !== 1) return res.status(403).json({ message: "Admin only route." });
    next();
};

export const isEmployee = (req, res, next) => {
    if (req.user.role !== 2) return res.status(403).json({ message: "Employee only route." });
    next();
};
