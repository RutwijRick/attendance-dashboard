import { toast } from "react-toastify";
import { utils, writeFile } from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';

export const formatHours = (hours) => {
    const h = Number(hours);
    if (isNaN(h) || h < 0) return "-";

    const totalMinutes = Math.round(h * 60);
    const hr = Math.floor(totalMinutes / 60);
    const min = totalMinutes % 60;

    if (hr === 0 && min === 0) return "0 min";

    const hrPart = hr ? `${hr} hr${hr !== 1 ? "s" : ""}` : "";
    const minPart = min ? `${min} min${min !== 1 ? "s" : ""}` : "";

    return [hrPart, minPart].filter(Boolean).join(" ");
};

// Optional: get token from localStorage
export const getAuthToken = () => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    return auth?.token || "";
};


export const handleApiError = (err, fallback = "Something went wrong") => {
    if (err?.response) {
        const { status, data } = err.response;
        const message = data?.message || fallback;

        console.log(err)

        if (status === 400) toast.warning(`${message}`);
        else if (status === 401) toast.error("Unauthorized");
        else if (status === 403) toast.error("Forbidden");
        else if (status === 404) toast.error("Not found");
        else if (status === 500) toast.error(`Server error: ${message}`);
        else toast.error(`${message}`);
    } else {
        toast.error("Network error. Please try again.");
    }
};

export const exportCSV = (records) => {
    const data = records.map(rec => ({
        Name: rec.employee?.name,
        Date: rec.date,
        "Check In": rec.checkInTime || '-',
        "Check Out": rec.checkOutTime || '-',
        Hours: rec.workHours || '-',
    }));

    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Attendance');
    writeFile(wb, 'attendance_report.xlsx');
};

// ➤ PDF Export:
export const exportPDF = (records) => {
    const doc = new jsPDF();
    autoTable(doc, {
        head: [['Name', 'Date', 'Check In', 'Check Out', 'Hours']],
        body: records.map(rec => [
            rec.employee?.name || '-',
            rec.date || '-',
            rec.checkInTime || '-',
            rec.checkOutTime || '-',
            rec.workHours || '-',
        ]),
        startY: 20,
    });
    doc.text('Attendance Report', 14, 15);
    doc.save('attendance_report.pdf');
};

export const formatDateToReadable = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const suffix =
        day % 10 === 1 && day !== 11 ? 'st' :
        day % 10 === 2 && day !== 12 ? 'nd' :
        day % 10 === 3 && day !== 13 ? 'rd' : 'th';

    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${day}${suffix} ${month} ${year}`;
}

export const toTimeInputString = (dateStr) => {
    const date = new Date(dateStr);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`; // returns "19:40"
}

export const calculateRealTimeHours = (checkInTime, currentDate = new Date()) => {
    try {
        const [h, m, s] = checkInTime.split(":").map(Number);
        const checkIn = new Date(currentDate);
        checkIn.setHours(h);
        checkIn.setMinutes(m);
        checkIn.setSeconds(s || 0);

        const diffMs = currentDate - checkIn;
        const diffHrs = diffMs / (1000 * 60 * 60);

        return diffHrs > 0 ? +diffHrs.toFixed(2) : 0;
    } catch {
        return 0;
    }
};

export const generateMonthlyDates = (year, month) => {
    const days = new Date(year, month + 1, 0).getDate(); // total days in month
    const dates = [];
    for (let d = 1; d <= days; d++) {
        const day = new Date(year, month, d);
        const formatted = day.toISOString().split('T')[0];
        dates.push(formatted);
    }
    return dates;
};