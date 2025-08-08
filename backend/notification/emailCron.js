// emailCron.js
import cron from 'node-cron';
import nodemailer from 'nodemailer';
import models from '../models/index.js';
import dayjs from 'dayjs';

export const startEmailCron = () => {
    // Run every day at 10:00 AM
    cron.schedule('0 10 * * *', async () => {
        const today = dayjs().format('YYYY-MM-DD');

        const employees = await models.User.findAll({ where: { role: 'employee' } });

        for (const emp of employees) {
            const attendance = await models.Attendance.findOne({
                where: {
                    employeeId: emp.id,
                    date: today,
                }
            });

            if (!attendance) {
                await sendEmail(emp.email, "Reminder: Please log your attendance today.");
            }
        }
    });
};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async (to, text) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject: "Attendance Reminder",
        text,
    });
};
