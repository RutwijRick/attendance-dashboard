import cron from 'node-cron';
import models from '../models/index.js';

const sendReminder = () => {
    const today = new Date().toISOString().split('T')[0];

    models.Attendance.findAll({
        where: {
            date: today,
            checkOutTime: null
        }
    }).then(records => {
        records.forEach(record => {
            console.log(`⏰ Reminder: Employee ${record.employeeId} hasn’t checked out!`);
            // Can integrate with email/sms later
        });
    });
};

// Every day at 6:30 PM
cron.schedule('30 18 * * *', sendReminder);
