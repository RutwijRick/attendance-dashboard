import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { sequelize } from './models/index.js';
import { initSocket } from './notification/socketHandler.js';
import { startReminderCron } from './notification/cron.js';
import { startEmailCron } from './notification/emailCron.js';
// import './seeders/createUsers.js'; To import admin and employee initally

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        // origin: 'http://localhost:5173',
        origin: 'https://clinquant-mochi-dfdea9.netlify.app/',
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    }
});

// Initialize socket logic
initSocket(io);

// Start cron jobs
startReminderCron(io);   // real-time reminder via socket
startEmailCron();        // daily email reminder 

// Start database and server
sequelize.authenticate()
    .then(() => {
        console.log("✅ Database connected");

        // To create tables & schemas if they don't exist use this initially
            // ---> return sequelize.sync({ alter: true }); // or { force: true } in dev to drop and recreate
    })
    .then(() => {
        server.listen(PORT, () => {
            console.log(`🚀 Server running on PORT: ${PORT}`);
        });
    })
    .catch(err => console.error("❌ DB connection failed:", err));
