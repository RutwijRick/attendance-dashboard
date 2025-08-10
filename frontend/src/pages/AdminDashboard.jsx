import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { handleApiError, formatDateToReadable } from "../utils/fn";
import api from "../utils/api";
import { XCircle, RefreshCw } from "react-feather";
import AdminAttendanceTable from "../components/AdminAttendanceTable";
import AdminFilterOptions from "../components/AdminFilterOptions";
import AdminStatsChart from "../components/AdminStatsChart";
import CronSettings from "../components/CronSettings";

const AdminDashboard = () => {
    const { auth } = useAuth();
    const [records, setRecords] = useState([]);

    const [viewMode, setViewMode] = useState("today");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [filterVisible, setFilterVisible] = useState(false);
    const [filter, setFilter] = useState({ from: "", to: "" });

    useEffect(() => {
        fetchRecords();
    }, [viewMode, selectedDate]);

    const fetchRecords = async () => {
        try {
            let res;

            if (viewMode === "today") {
                const dateStr = selectedDate.toISOString().split("T")[0];
                res = await api.get("attendanceAll", { params: { date: dateStr } });

            } else if (viewMode === "range") {
                res = await api.get("attendanceAll", {
                    params: {
                        from: filter.from,
                        to: filter.to
                    }
                });

            } else {
                res = await api.get("attendanceAll");
            }

            console.log(res)

            if (Array.isArray(res.data)) {
                setRecords(res.data);
            } else if (Array.isArray(res.data.records)) {
                setRecords(res.data.records);
            } else {
                setRecords([]);
            }
        } catch (err) {
            console.log(err)
            handleApiError(err, "Failed to fetch records");
            setRecords([]);
        }
    };

    const removeAllFilters = () => {
        setViewMode("today");
        setFilterVisible(true);
    }

    const refreshData = () => {
        fetchRecords();
    }


    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-xs-12 col-md-12 col-lg-12">
                    <h2>Admin Dashboard <button className="btn btn-sm btn-success" onClick={() => refreshData()}><RefreshCw /> Refresh</button></h2>
                    <h6 className="text-muted">
                        {viewMode === "today" && `Attendance For ${formatDateToReadable(selectedDate)}`}
                        {viewMode === "range" && `Filtered Attendance: ${formatDateToReadable(filter.from)} To ${formatDateToReadable(filter.to)}`}
                        {viewMode !== "today" && viewMode !== "range" && `Filtered Attendance: All`}

                        {viewMode !== "today" && <button className="badge bg-danger m-2" onClick={() => removeAllFilters()} style={{ border: "none" }}><XCircle size={16} /> Remove Filter</button>}
                    </h6>
                </div>
            </div>

            {/* <div>
                <CronSettings/>
            </div> */}

            <AdminFilterOptions
                records={records}
                viewMode={viewMode}
                setViewMode={setViewMode}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                filterVisible={filterVisible}
                setFilterVisible={setFilterVisible}
                filter={filter}
                setFilter={setFilter}
            />
            <hr />

            <div className="col-xs-12 col-md-12 col-lg-12" style={{height: '10%'}}>
                <AdminStatsChart records={records} viewMode={viewMode} />
            </div>


            <div className="col-xs-12 col-md-12 col-lg-12">
                <AdminAttendanceTable records={records} refresh={fetchRecords} mode={viewMode} />
            </div>
        </div>
    );
};

export default AdminDashboard;
