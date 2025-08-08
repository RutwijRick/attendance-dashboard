import { toast } from 'react-toastify';
import { useEffect } from 'react';
import socket from './socketClient'; 

const useSocketNotifications = () => {
    useEffect(() => {
        if (!socket) return;

        socket.on('checkout_reminder', (data) => {
            toast.info(data.message || "Don’t forget to check out!");
        });

        return () => {
            socket.off('checkout_reminder');
        };
    }, []);
};

export default useSocketNotifications;
