// server.js

import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { sequelize } from './models/index.js';

// 👇 import these
import { initSocket } from './notification/socketHandler.js';
import { startReminderCron } from './notification/cron.js';
import { startEmailCron } from './notification/emailCron.js';
import './seeders/createUsers.js';

const PORT = process.env.PORT || 5000;

// Create HTTP server instance
const server = http.createServer(app);

// Create socket.io instance
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173', // Or set your frontend domain
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    }
});

// Initialize socket logic
initSocket(io);

// Start cron jobs
startReminderCron(io);   // real-time reminder via socket
startEmailCron();        // daily email reminder

// sequelize.sync({ alter: true }) // or { force: true } to drop and recreate tables
//   .then(() => {
//     console.log("🛠️ DB synced");
// });

// Start database and server
sequelize.authenticate()
    .then(() => {
        console.log("✅ Database connected");

        // 👇 This will create tables if they don't exist
        return sequelize.sync({ alter: true }); // or { force: true } in dev to drop and recreate
    })
    .then(() => {
        server.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    })
    .catch(err => console.error("❌ DB connection failed:", err));
