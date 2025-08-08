import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import models from '../models/index.js';

dotenv.config();

export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await models.User.findOne({ where: { username } });

        if (!user) {
            return res.status(404).json({ message: "Invalid username or password." });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid username or password." });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return res.status(200).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                username: user.username,
                role: user.role,
            },
        });

    } catch (error) {
        return res.status(500).json({ message: "Login error", error });
    }
};
