import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
    const { auth } = useAuth();

    if (!auth?.token) return <Navigate to="/login" />;
    if (role && auth.user.role !== role) return <Navigate to="/" />;

    return children;
};

export default ProtectedRoute;
