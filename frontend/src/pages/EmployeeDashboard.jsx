import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import urls from "../utils/urls";
import api from "../utils/api";
import { formatHours, generateMonthlyDates, handleApiError } from "../utils/fn";
import EmployeeAttendanceTable from "../components/EmployeeAttendanceTable";
import EmployeeStatsChart from "../components/EmployeeStatsChart";
import { Box, CheckCircle, CheckSquare, Circle, RefreshCw } from "react-feather";

const EmployeeDashboard = () => {
    const { auth } = useAuth();
    const [records, setRecords] = useState([]);
    const today = new Date();
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth()); // 0-indexed
    const [selectedYear, setSelectedYear] = useState(today.getFullYear());

    const fetchData = async () => {
        try {
            const from = new Date(selectedYear, selectedMonth, 1).toISOString().split('T')[0];
            const to = new Date(selectedYear, selectedMonth + 1, 0).toISOString().split('T')[0];

            const res = await api.get("employeeAttendance", { params: { from, to } });
            const actual = Array.isArray(res.data) ? res.data : [];

            const allDates = generateMonthlyDates(selectedYear, selectedMonth);

            const fullData = allDates.map(date => {
                const found = actual.find(r => r.date === date);
                return found || {
                    date,
                    checkInTime: null,
                    checkOutTime: null,
                    workHours: null,
                    status: "absent"
                };
            });

            setRecords(fullData);
        } catch (err) {
            handleApiError(err, "Failed to fetch records");
            setRecords([]);
        }
    };


    const checkIn = async () => {
        try {
            await api.post("attendanceCheckin");
            toast.success("Checked in");
            fetchData();
        } catch (err) {
            handleApiError(err, "Check-in failed");
        }
    };

    const checkOut = async () => {
        try {
            await api.post("attendanceCheckout");
            toast.success("Checked out");
            fetchData();
        } catch (err) {
            handleApiError(err, "Check-out failed");
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedMonth, selectedYear]);

    const refreshData = () => {
        fetchData();
    }

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-xs-12 col-md-12 col-lg-12">
                    <h2>Employee Dashboard
                        <button className="btn btn-sm btn-success me-2 ms-2" onClick={() => refreshData()}><RefreshCw /> Refresh</button>
                        <button className="btn btn-sm btn-warning text-white me-2" onClick={checkIn}><CheckCircle /> Check In</button>
                        <button className="btn btn-sm btn-danger me-2" onClick={checkOut}><Circle />  Check Out</button>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                            style={{float: "right"}}

                        >
                            {Array.from({ length: 5 }).map((_, idx) => {
                                const year = new Date().getFullYear() - idx;
                                return <option key={year} value={year}>{year}</option>;
                            })}
                        </select>
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(Number(e.target.value))}
                            style={{float: "right"}}
                        >
                            {Array.from({ length: 12 }).map((_, idx) => (
                                <option key={idx} value={idx}>
                                    {new Date(0, idx).toLocaleString('default', { month: 'long' })}
                                </option>
                            ))}
                        </select>
                    </h2>
                    {/* <h6 className="text-muted">
                        {viewMode === "today" && `Attendance For ${formatDateToReadable(selectedDate)}`}
                        {viewMode === "range" && `Filtered Attendance: ${formatDateToReadable(filter.from)} To ${formatDateToReadable(filter.to)}`}
                        {viewMode !== "today" && viewMode !== "range" && `Filtered Attendance: All`}

                        {viewMode !== "today" && <button className="badge bg-danger m-2" onClick={() => removeAllFilters()} style={{ border: "none" }}><XCircle size={16} /> Remove Filter</button>}
                    </h6> */}
                </div>
                {/* <div className="col-xs-12 col-md-12 col-lg-12"></div> */}
                <hr />
            </div>

            <div className="col-xs-12">
                <EmployeeStatsChart records={records} />
            </div>
            <div className="col-xs-12">
                <EmployeeAttendanceTable records={records} />
            </div>
        </div>
    );
};

export default EmployeeDashboard;
