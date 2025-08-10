import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();


const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    // origin: "https://clinquant-mochi-dfdea9.netlify.app/",
    credentials: true, 
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

export default app;
