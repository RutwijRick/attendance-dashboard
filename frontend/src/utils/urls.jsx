const urlPrefix = import.meta.env.VITE_API_BASE_URL;

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