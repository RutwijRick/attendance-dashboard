import React from 'react';
import { formatHours, handleApiError } from '../utils/fn';
import urls from '../utils/urls';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const AdminAddAttendanceModal = ({ newData, setNewData, refresh }) => {
    const { auth } = useAuth();

    const calculateHours = (checkIn, checkOut) => {
        if (!checkIn || !checkOut) return null;

        try {
            const [h1, m1] = checkIn.split(":").map(Number);
            const [h2, m2] = checkOut.split(":").map(Number);

            let t1 = h1 * 60 + m1;
            let t2 = h2 * 60 + m2;
            if (t2 < t1) t2 += 24 * 60;

            return (t2 - t1) / 60; // hours
        } catch {
            return null;
        }
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                employeeId: newData.employee.id,
                date: newData.date,
                checkInTime: newData.checkInTime,
                checkOutTime: newData.checkOutTime,
                workHours: calculateHours(newData.checkInTime, newData.checkOutTime)
            };

            await api.post("adminCheckIn", payload);
            toast.success("Attendance added");
            setNewData(null);
            refresh();
        } catch (err) {
            console.log(err)
            handleApiError(err, "Failed to add attendance");
        }
    };

    return (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add Attendance</h5>
                        <button type="button" className="btn-close" onClick={() => setNewData(null)}></button>
                    </div>
                    <div className="modal-body">
                        <p><strong>Employee:</strong> {newData.employee.name}</p>
                        <p><strong>Date:</strong> {newData.date}</p>
                        <div className="form-group">
                            <label>Check-In Time</label>
                            <input
                                type="time"
                                className="form-control"
                                value={newData.checkInTime || ""}
                                onChange={(e) => setNewData({ ...newData, checkInTime: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Check-Out Time</label>
                            <input
                                type="time"
                                className="form-control"
                                value={newData.checkOutTime || ""}
                                onChange={(e) => setNewData({ ...newData, checkOutTime: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Calculated Hours</label>
                            <input
                                type='text'
                                className="form-control"
                                readOnly
                                value={formatHours(calculateHours(newData.checkInTime, newData.checkOutTime))}
                            />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => setNewData(null)}>Cancel</button>
                        <button type="button" className="btn btn-primary" onClick={handleSubmit}>Save</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAddAttendanceModal;
