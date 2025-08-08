// SocketManager.jsx
import useSocketAuth from './services/useSocketAuth';
import useSocketNotifications from './services/useSocketNotifications';

const SocketManager = () => {
    useSocketAuth();
    // useSocketNotifications();
    return null;
};

export default SocketManager;
