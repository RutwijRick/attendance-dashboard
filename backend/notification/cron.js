import cron from 'node-cron';
import { getLoggedInUsers } from '../notification/socketHandler.js';
import models, { sequelize } from '../models/index.js';
import dayjs from 'dayjs';

export const startReminderCron = (io) => {
    // Check every 1 minute
    cron.schedule('*/1 * * * *', async () => {
        console.log("🕑 Checking for users to notify...");

        const now = dayjs();
        const [records] = await sequelize.query(`
            SELECT a.*
            FROM attendance a
            INNER JOIN (
                SELECT employeeId, MAX(date) as maxDate
                FROM attendance
                WHERE checkOutTime IS NULL
                GROUP BY employeeId
            ) latest
            ON a.employeeId = latest.employeeId AND a.date = latest.maxDate
            WHERE a.checkOutTime IS NULL
        `);

        records.forEach(record => {
            const userId = record.employeeId;
            const checkInTime = dayjs(`${record.date}T${record.checkInTime}`);

            const durationInHours = now.diff(checkInTime, 'minute') / 60;

            // if (durationInHours >= 6) {
                const loggedInUsers = getLoggedInUsers();
                const socketId = loggedInUsers.get(userId);
                if (socketId) {
                    io.to(socketId).emit('notification', "Reminder: Don't forget to check out!");
                }
            // }
        });
    });
};
