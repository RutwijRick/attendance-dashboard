import React from 'react'
import { formatHours, handleApiError } from '../utils/fn'
import urls from '../utils/urls';
import api from '../utils/api';
import { toast } from 'react-toastify';

const AdminEditAttendanceModal = ({ editData, setEditData, refresh }) => {

    const calculateHours = (checkIn, checkOut) => {
        if (!checkIn || !checkOut) return null;

        try {
            const [h1, m1, s1 = 0] = checkIn.split(":").map(Number);
            const [h2, m2, s2 = 0] = checkOut.split(":").map(Number);

            if ([h1, m1, s1, h2, m2, s2].some(isNaN)) return null;

            let t1 = h1 * 3600 + m1 * 60 + s1;
            let t2 = h2 * 3600 + m2 * 60 + s2;

            // Handle overnight check-out
            if (t2 < t1) t2 += 24 * 3600;

            const diffSeconds = t2 - t1;
            return diffSeconds / 3600;
        } catch {
            return null;
        }
    };


    const handleSubmit = async () => {
        try {
            const updated = {
                checkInTime: editData.checkInTime,
                checkOutTime: editData.checkOutTime,
                workHours: calculateHours(editData.checkInTime, editData.checkOutTime),
            };

            const url = urls.editAttendanceAdmin(editData.id);
            await api.put(url, updated);

            toast.success("Attendance updated");
            setEditData(null);
            refresh();
        } catch (err) {
            console.log(err)
            handleApiError(err, "Update failed");
        }
    };

    return (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Edit Attendance</h5>
                        <button type="button" className="close" onClick={() => setEditData(null)}>
                            <span>&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="form-group">
                            <label>Check-In Time</label>
                            <input
                                type="time"
                                className="form-control"
                                value={editData.checkInTime}
                                max="23:59"
                                onChange={(e) =>
                                    setEditData({
                                        ...editData,
                                        checkInTime: e.target.value,
                                        // Also update checkout if it's before the new checkin
                                        ...(editData.checkOutTime && e.target.value > editData.checkOutTime
                                            ? { checkOutTime: "" }
                                            : {})
                                    })
                                }
                            />
                        </div>
                        <div className="form-group">
                            <label>Check-Out Time</label>
                            <input
                                type="time"
                                className="form-control"
                                value={editData.checkOutTime}
                                min={editData.checkInTime || "00:00"}
                                max="23:59"
                                onChange={(e) => setEditData({ ...editData, checkOutTime: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Calculated Hours</label>
                            <input
                                type='text'
                                className="form-control"
                                readOnly
                                value={formatHours(calculateHours(editData.checkInTime, editData.checkOutTime))}
                            />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => setEditData(null)}>Cancel</button>
                        <button type="button" className="btn btn-primary" onClick={handleSubmit}>Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminEditAttendanceModal