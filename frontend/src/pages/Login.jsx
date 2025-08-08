import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const { login, user, auth } = useAuth();
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        console.log("auth", auth?.user?.role)
        if (auth?.user?.role === 1) navigate('/admin');
        else if (auth?.user?.role === 2) navigate('/employee');
    }, [auth, navigate]);

    // 🔁 Avoid infinite loop with proper dependency check
    useEffect(() => {
        if (user) {
            navigate(user.role === 'admin' ? '/admin' : '/employee');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(credentials);
            // Navigation will be handled by useEffect after login
        } catch (err) {
            console.error('Login failed:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4 col-md-6 login-container">
            <form onSubmit={handleSubmit} className="col-md-4">
                <h2 className="mb-3 text-center">Login</h2>
                <input
                    className="form-control mb-2"
                    placeholder="Username"
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                />
                <input
                    className="form-control mb-2"
                    type="password"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                />
                <button className="btn btn-primary w-100" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
};

export default Login;
