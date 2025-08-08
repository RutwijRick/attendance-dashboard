import bcrypt from 'bcrypt';
import User from "../models/User.js";

export const registerUser = async (req, res) => {
    try {
        const { name, username, password, role } = req.body;

        if (!name || !username || !password || !role) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existing = await User.findOne({ where: { username } });
        if (existing) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            username,
            password: hashedPassword,
            role,
        });

        res.status(201).json({ message: 'User created', user: newUser });
    } catch (err) {
        res.status(500).json({ message: 'Registration failed', error: err });
    }
};