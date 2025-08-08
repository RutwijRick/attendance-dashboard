// FOR LOCAL
const urlPrefix = 'http://localhost:5000/api';
// FOR LOCAL

// FOR SERVER
// const urlPrefix = 'https://www.kiratcommunications.com/kb/api';
// FOR SERVER

const urls = {
    // Auth
    authLogin:urlPrefix+'/auth/login',
    
    // Attendance
    employeeAttendance:urlPrefix+'/attendance/me',
    attendanceCheckin:urlPrefix+'/attendance/checkin',
    attendanceCheckout:urlPrefix+'/attendance/checkout',
    attendanceAll:urlPrefix+'/attendance',
    editAttendanceAdmin: (id) => `${urlPrefix}/attendance/${id}`,

    // User
    registerUser: urlPrefix + "/users/register",
    updateCronTimer: urlPrefix + "/admin/settings/notification-timer",

}

export default urls;