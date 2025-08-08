import models from '../models/index.js';
import { Op } from 'sequelize';
import { exportCSV, exportPDF } from '../utils/exportUtils.js';
import { calculateWorkHours } from '../utils/calculateWorkHours.js';

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

        const workHours = calculateWorkHours(record.date,record.checkInTime,checkOutTimeStr);

        record.checkOutTime = checkOutTimeStr;
        record.workHours = workHours;
        record.updatedBy = employeeId;
        record.lastUpdatedTimestamp = now;

        await record.save();

        res.json({ message: 'Checked out.', record });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Check-out failed.', error: err });
    }
};

export const getAllAttendance = async (req, res) => {
    const { from, to, date, employeeId } = req.query;
    const where = {};

    try {
        if (date) {
            where.date = date;
        } else if (from && to) {
            where.date = { [Op.between]: [from, to] };
        }

        if (employeeId) {
            where.employeeId = employeeId;
        }

        const records = await models.Attendance.findAll({
            where,
            include: [{ model: models.User, as: 'employee', attributes: ['id', 'name'] }],
            order: [['date', 'DESC']],
        });

        res.json(records);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching attendance', error: err });
    }
};

export const updateAttendance = async (req, res) => {
    const { id } = req.params;
    const { checkInTime, checkOutTime, workHours } = req.body;

    try {
        const record = await models.Attendance.findByPk(id);
        if (!record) return res.status(404).json({ message: "Record not found" });

        const workHoursCalc = calculateWorkHours(record.date,checkInTime,checkOutTime);

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
