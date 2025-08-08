import { Parser } from 'json2csv';
import PDFDocument from 'pdfkit';
import fs from 'fs';

export const exportCSV = (records) => {
    const fields = ['date', 'employeeId', 'checkInTime', 'checkOutTime', 'workHours'];
    const parser = new Parser({ fields });
    return parser.parse(records);
};

export const exportPDF = (records, res) => {
    const doc = new PDFDocument();
    doc.pipe(res);

    doc.fontSize(18).text('Attendance Report', { align: 'center' }).moveDown();

    records.forEach((rec) => {
        doc
            .fontSize(12)
            .text(`Date: ${rec.date}, Employee: ${rec.employeeId}, In: ${rec.checkInTime}, Out: ${rec.checkOutTime}, Hours: ${rec.workHours}`);
    });

    doc.end();
};
