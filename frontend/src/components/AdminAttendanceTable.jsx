import React, { useState } from 'react';
import { Edit, User } from 'react-feather';
import { formatDateToReadable, formatHours, handleApiError } from '../utils/fn';
import api from '../utils/api';
import { toast } from 'react-toastify';
import urls from '../utils/urls';
import AdminEditAttendanceModal from './AdminEditAttendanceModal';

const AdminAttendanceTable = ({ records, refresh }) => {
    const [editData, setEditData] = useState(null);

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
                        <th>Date</th>
                        <th>Check-In</th>
                        <th>Check-Out</th>
                        <th>Hours</th>
                        <th>Action</th>
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
                            <td>{formatDateToReadable(rec.date)}</td>
                            <td>{rec.checkInTime || "-"}</td>
                            <td>{rec.workHours === null ? (<><span className="badge bg-danger">Not Checked Out</span></>) : rec.checkOutTime}</td>
                            <td>{rec.workHours ? formatHours(rec.workHours) : "-"}</td>
                            <td>
                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => handleEdit(rec)}
                                >
                                    <Edit size={14} /> Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                    {records.length === 0 && (
                        <tr>
                            <td colSpan="6" className="text-center">No records found.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {editData && (
                <AdminEditAttendanceModal 
                editData={editData}
                setEditData={setEditData}
                refresh={refresh}
                />
            )}
        </div>
    )
}

export default AdminAttendanceTable