import React, { useState } from 'react';
import { CheckCircle, Edit, User } from 'react-feather';
import { formatDateToReadable, formatHours, handleApiError } from '../utils/fn';
import AdminEditAttendanceModal from './AdminEditAttendanceModal';
import { toast } from 'react-toastify';
import api from '../utils/api';
import AdminAddAttendanceModal from './AdminAddAttendanceModal';

const AdminAttendanceTable = ({ records, refresh, mode }) => {
    const [editData, setEditData] = useState(null);
    const [newData, setNewData] = useState(null);

    const handleEdit = (rec) => {
        setEditData({
            ...rec,
            checkInTime: rec.checkInTime || "",
            checkOutTime: rec.checkOutTime || "",
        });
    };

    return (
        <div className="table-responsive">
            <table className="table table-bordered mt-3">
                <thead className="table-dark">
                    <tr>
                        <th>Employee</th>
                        {mode === 'range' ? (
                            <>
                            <td colSpan={5}>Total Hrs</td>
                            </>
                        ) : (
                            <>
                            <th>Date</th>
                            <th>Check-In</th>
                            <th>Check-Out</th>
                            <th>Hours</th>
                            <th>Status</th>
                            <th>Action</th>
                            </>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {records.map((rec, i) => (
                        <tr key={i}>
                            <td>
                                <button className="btn btn-outline-primary btn-sm">
                                    <User size={14} /> {rec.employee?.name}
                                </button>
                            </td>
                            {mode === 'range' ? (
                                <>
                                <td colSpan={5}>{rec.workHours} hrs</td>
                                </>
                            ) : (
                                <>
                                    <td>{formatDateToReadable(rec.date)}</td>
                                    <td>{rec.checkInTime}</td>
                                    <td>{rec.checkOutTime}</td>
                                    <td>{rec.workHours && rec.workHours !== 'Absent' && rec.workHours !== 'Not checked out'
                                        ? formatHours(rec.workHours)
                                        : rec.workHours}</td>
                                    <td>
                                        {rec.status === 'Present' && <span className="badge bg-success">Present</span>}
                                        {rec.status === 'Not checked out' && <span className="badge bg-warning">Not Checked Out</span>}
                                        {rec.status === 'Absent' && <span className="badge bg-danger">Absent</span>}
                                    </td>
                                    <td>
                                        {rec.status === "Absent" ? (
                                            <button
                                                className="btn btn-sm btn-success"
                                                onClick={() => setNewData({
                                                    employee: rec.employee,
                                                    date: rec.date
                                                })}
                                            >
                                                <CheckCircle size={14} /> Check-In
                                            </button>
                                        ) : (
                                            <button
                                                className="btn btn-sm btn-primary"
                                                onClick={() => handleEdit(rec)}
                                                disabled={rec.status === 'Absent'} // disable edit if absent
                                            >
                                                <Edit size={14} /> Edit
                                            </button>
                                        )}
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            {editData && (
                <AdminEditAttendanceModal
                    editData={editData}
                    setEditData={setEditData}
                    refresh={refresh}
                />
            )}

            {newData && (
                <AdminAddAttendanceModal
                    newData={newData}
                    setNewData={setNewData}
                    refresh={refresh}
                />
            )}
        </div>
    )
}

export default AdminAttendanceTable