import React, { useState } from "react";
import { toast } from "react-toastify";
import api from "../utils/api";

const Register = () => {
    const [form, setForm] = useState({
        name: "",
        username: "",
        password: "",
        role: "2", // default to employee
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("registerUser", form);
            toast.success("User registered successfully");
            setForm({ name: "", username: "", password: "", role: "2" });
        } catch (err) {
            toast.error(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="container mt-4 col-md-6">
            <h3>Register New User</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="form-control my-2"
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                    type="text"
                    className="form-control my-2"
                    placeholder="Username"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                />
                <input
                    type="password"
                    className="form-control my-2"
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <select
                    className="form-control my-2"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                    <option value="1">Admin</option>
                    <option value="2">Employee</option>
                </select>
                <button className="btn btn-success w-100">Register</button>
            </form>
        </div>
    );
};

export default Register;
