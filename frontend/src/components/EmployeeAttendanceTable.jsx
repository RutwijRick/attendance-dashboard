import React from 'react'
import { formatDateToReadable, formatHours } from '../utils/fn'

const EmployeeAttendanceTable = ({ records }) => {
    return (
        <div className="table-responsive">
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Check-In</th>
                        <th>Check-Out</th>
                        <th>Hours</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map((r, i) => {
                        const status = !r.checkInTime
                            ? "Absent"
                            : !r.checkOutTime
                                ? "Not Checked Out"
                                : formatHours(r.workHours);

                        return (
                            <tr key={i}>
                                <td>{formatDateToReadable(r.date)}</td>
                                <td>{r.checkInTime || "-"}</td>
                                <td>{r.checkOutTime || "-"}</td>
                                <td>{status}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default EmployeeAttendanceTable