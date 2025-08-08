export const calculateWorkHours = (date, checkInTime, checkOutTime) => {
    const checkInDateTime = new Date(`${date}T${checkInTime}`);
    const checkOutDateTime = new Date(`${date}T${checkOutTime}`);

    const diffMs = checkOutDateTime - checkInDateTime;
    const workHours = diffMs > 0 ? parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2)) : 0;

    return workHours;
}