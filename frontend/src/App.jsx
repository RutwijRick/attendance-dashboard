import { BrowserRouter as Router, Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import { useState } from 'react';
import { useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css'; 
import Register from './pages/Register';
import SocketManager from './SocketManager';

const App = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, []);

    if (loading) return <div>Loading app...</div>;

    return (
        <AuthProvider>
            <BrowserRouter>
                <SocketManager />
                <Navbar />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Navigate to="/login" />} />

                    <Route path="/admin" element={
                        <ProtectedRoute role={1}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />

                    <Route path="/register" element={
                        <ProtectedRoute role={1}>
                            <Register />
                        </ProtectedRoute>
                    } />

                    <Route path="/employee" element={
                        <ProtectedRoute role={2}>
                            <EmployeeDashboard />
                        </ProtectedRoute>
                    } />
                </Routes>
                <ToastContainer/>
            </BrowserRouter>
        </AuthProvider>
    );
};

export default App;
