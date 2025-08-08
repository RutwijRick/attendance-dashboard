import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import urls from '../utils/urls';
import socket from '../services/socketClient';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        const stored = localStorage.getItem('auth');
        return stored ? JSON.parse(stored) : null;
    });

    useEffect(() => {
        if (auth?.user?.id) {
            socket.emit('userLoggedIn', auth.user.id);
            return () => socket.emit('userLoggedOut', auth.user.id);
        }
    }, [auth]);

    useEffect(() => {
        const handleNotification = (msg) => toast.info(msg);
        socket.on('notification', handleNotification);

        return () => {
            socket.off('notification', handleNotification); 
        };
    }, []);

    const login = async (credentials) => {
        try {
            const res = await axios.post(urls.authLogin, credentials);
            const { user, token } = res.data;
            setAuth({ user, token });
            localStorage.setItem('auth', JSON.stringify({ user, token }));
            toast.success("Login successful");
            return user;
        } catch (err) {
            toast.error(err.response?.data?.message || "Login failed");
            throw err;
        }
    };

    const logout = () => {
        setAuth(null);
        localStorage.removeItem('auth');
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
