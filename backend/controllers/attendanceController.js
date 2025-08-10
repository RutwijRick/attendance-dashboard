import models from '../models/index.js';
import { col, fn, Op } from 'sequelize';
import { exportCSV, exportPDF } from '../utils/exportUtils.js';
import { calculateWorkHours } from '../utils/calculateWorkHours.js';
import dayjs from 'dayjs';

export const checkIn = async (req, res) => {
    const employeeId = req.user.id;
    const today = new Date().toISOString().split('T')[0];

    try {
        const existing = await models.Attendance.findOne({
            where: { employeeId, date: today }
        });

        if (existing) {
            return res.status(400).json({ message: 'Already checked in today.' });
        }

        const now = new Date();

        const attendance = await models.Attendance.create({
            employeeId,
            date: today,
            checkInTime: now.toTimeString().slice(0, 8),
            createdBy: employeeId,
            lastUpdatedTimestamp: now,
        });

        res.status(201).json({ message: 'Checked in.', attendance });
    } catch (err) {
        res.status(500).json({ message: 'Check-in failed.', error: err });
    }
};

export const checkOut = async (req, res) => {
    const employeeId = req.user.id;
    const today = new Date().toISOString().split('T')[0];

    try {
        const record = await models.Attendance.findOne({
            where: { employeeId, date: today },
        });

        if (!record) {
            return res.status(404).json({ message: 'No check-in found today.' });
        }

        if (record.checkOutTime) {
            return res.status(400).json({ message: 'Already checked out.' });
        }
        
        const checkOutTimeStr = dayjs().format('HH:mm:ss');

        const workHours = calculateWorkHours(record.date, record.checkInTime, checkOutTimeStr);

        record.checkOutTime = checkOutTimeStr;
        record.workHours = workHours;
        record.updatedBy = employeeId;
        record.lastUpdatedTimestamp = dayjs().format('YYYY-MM-DD HH:mm:ss');;

        await record.save();

        res.json({ message: 'Checked out.', record });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Check-out failed.', error: err });
    }
};

export const getAllAttendance = async (req, res) => {
    const { from, to, date, employeeId } = req.query;

    try {
        // Employee filter
        const employeeWhere = { role: 2 }; // or 'employee' depending on DB storage
        if (employeeId) {
            employeeWhere.id = employeeId;
        }

        // Attendance filter
        const attendanceWhere = {};
        if (date) {
            attendanceWhere.date = date;
        } else if (from && to) {
            attendanceWhere.date = { [Op.between]: [from, to] };
        }

        // Fetch all employees with attendance
        const employees = await models.User.findAll({
            where: employeeWhere,
            include: [
                {
                    model: models.Attendance,
                    as: 'attendances',
                    required: false, // so absent users show too
                    where: Object.keys(attendanceWhere).length
                        ? attendanceWhere
                        : undefined,
                    order: [['date', 'DESC']]
                }
            ],
            order: [['id', 'ASC']]
        });

        // Map results with attendanceId
        const result = employees.map(emp => {
            const att = emp.attendances[0] || null; // only 1 record per date in this view
            let status, checkIn, checkOut, hours, attendanceId;

            if (!att) {
                status = 'Absent';
                checkIn = 'Absent';
                checkOut = 'Absent';
                hours = 'Absent';
                attendanceId = null;
            } else if (att.checkInTime && !att.checkOutTime) {
                status = 'Not checked out';
                checkIn = att.checkInTime;
                checkOut = 'Not checked out';
                hours = 'Not checked out';
                attendanceId = att.id;
            } else if (att.checkInTime && att.checkOutTime) {
                status = 'Present';
                checkIn = att.checkInTime;
                checkOut = att.checkOutTime;
                hours = att.workHours;
                attendanceId = att.id;
            }

            return {
                employee: { id: emp.id, name: emp.name },
                attendanceId,
                date: date || (att ? att.date : null),
                checkInTime: checkIn,
                checkOutTime: checkOut,
                workHours: hours,
                status
            };
        });

        res.json(result);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching attendance', error: err });
    }
};


export const adminCheckIn = async (req, res) => {
    try {
        const { employeeId, date, checkInTime, checkOutTime, workHours } = req.body;
        const adminId = req.user.id; // from verifyToken middleware
        const targetDate = date || dayjs().format('YYYY-MM-DD');

        // Prevent duplicate check-in for the same day
        const existing = await models.Attendance.findOne({
            where: { employeeId, date: targetDate }
        });
        if (existing) {
            return res.status(400).json({ message: "Employee already has an attendance record for this date." });
        }

        const attendance = await models.Attendance.create({
            employeeId,
            date: targetDate,
            checkInTime: checkInTime || dayjs().format('HH:mm:ss'),
            checkOutTime: checkOutTime || null,
            workHours: workHours || null,
            createdBy: adminId
        });

        res.json({ message: "Attendance added successfully by Admin.", attendance });
    } catch (err) {
        res.status(500).json({ message: 'Error adding attendance', error: err });
    }
};


export const updateAttendance = async (req, res) => {
    const { id } = req.params;
    console.log(id)
    const { checkInTime, checkOutTime, workHours } = req.body;

    try {
        const record = await models.Attendance.findByPk(id);
        if (!record) return res.status(404).json({ message: "Record not found" });

        const workHoursCalc = calculateWorkHours(record.date, checkInTime, checkOutTime);

        record.checkInTime = checkInTime;
        record.checkOutTime = checkOutTime;
        record.workHours = workHoursCalc;
        record.lastUpdatedTimestamp = new Date();

        await record.save();

        res.json({ message: "Attendance updated", record });
    } catch (err) {
        res.status(500).json({ message: "Failed to update", error: err });
    }
};

export const getMyAttendance = async (req, res) => {
    try {
        const records = await models.Attendance.findAll({
            where: { employeeId: req.user.id },
            order: [['date', 'DESC']],
        });

        res.json(records);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching records', error: err });
    }
};

export const downloadReport = async (req, res) => {
    const { format = 'csv', from, to } = req.query;

    try {
        const records = await models.Attendance.findAll({
            where: {
                date: { [Op.between]: [from, to] }
            }
        });

        if (format === 'pdf') {
            res.setHeader('Content-Type', 'application/pdf');
            exportPDF(records, res);
        } else {
            const csv = exportCSV(records);
            res.header('Content-Type', 'text/csv');
            res.attachment('report.csv');
            return res.send(csv);
        }
    } catch (err) {
        res.status(500).json({ message: 'Export failed', error: err });
    }
};
