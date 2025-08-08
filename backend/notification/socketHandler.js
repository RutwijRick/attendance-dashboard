// socket.js
const loggedInUsers = new Map();

export const initSocket = (io) => {
    io.on('connection', (socket) => {
        console.log("⚡ New client connected", socket.id);

        socket.on('userLoggedIn', (userId) => {
            loggedInUsers.set(userId, socket.id);
            console.log(`✅ User ${userId} online`);
        });

        socket.on('userLoggedOut', (userId) => {
            loggedInUsers.delete(userId);
            console.log(`🔌 User ${userId} logged out`);
        });

        socket.on('disconnect', () => {
            for (const [userId, id] of loggedInUsers.entries()) {
                if (id === socket.id) {
                    loggedInUsers.delete(userId);
                    console.log(`❌ User ${userId} disconnected`);
                    break;
                }
            }
        });
    });
};

// Export this map for cron.js to use
export const getLoggedInUsers = () => loggedInUsers;
