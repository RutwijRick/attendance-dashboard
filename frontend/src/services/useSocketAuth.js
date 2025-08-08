import { useEffect } from 'react';
import socket from './socketClient';
import { useAuth } from '../context/AuthContext';

const useSocketAuth = () => {
    const { auth } = useAuth();

    useEffect(() => {
        if (auth?.user) {
            socket.connect();
            socket.emit('login', auth.user.id);

            return () => {
                socket.emit('logout', auth.user.id);
                socket.disconnect();
            };
        }
    }, [auth]);
};

export default useSocketAuth;
