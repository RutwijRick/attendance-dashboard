# MERN Attendance Management System

An attendance management system built with the MERN stack (MySQL, Express, React, Node.js) designed for both **Employees** and **Admins**.
Hosted here: https://clinquant-mochi-dfdea9.netlify.app/

## Features

### Employees
- Check-in / Check-out with auto work hours calculation
- View daily and monthly attendance reports
- Real-time notifications for check-out reminders
- Absent/Incomplete log detection

### Admins
- View and edit attendance records
- Export attendance to PDF/CSV
- Set custom notification timers (6 hrs, 10 min, etc.)
- Admin dashboard with graphs and filters
- Pagination and filtering options

---

## Tech Stack

| Frontend | Backend | Database | Others |
|---------|---------|----------|--------|
| React (Vite, Bootstrap, Toastr, Chart.js) | Express.js (Node.js) | MySQL (Aiven / AlwaysData) | Socket.IO, Nodemailer, Cron Jobs, Render, Netlify |

---

#### Backend `.env.example` (required)
PORT=5000

DB_NAME=your_db
DB_USER=your_user
DB_PASS=your_password
DB_HOST=your_db_host
DB_PORT=your_db_port

JWT_SECRET=yourSuperSecretKey
JWT_EXPIRES_IN=7d

NOTIFY_AFTER=1m

EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password


### Frontend `.env.example` (required)
VITE_API_BASE=https://your-render-backend.onrender.com/api
---

## 📁 Project Structure
attendance-system/
├── backend/ # Express, Sequelize, Cron jobs, Socket.IO
├── frontend/ # ReactJS app with Bootstrap UI
└── README.md

## Play with the application
https://clinquant-mochi-dfdea9.netlify.app/

---

## Deployment Details
Backend (Node.JS): Hosted on Render
Frontend: Hosted on Netlify
MySQL DB: alwaysdata.com 

## Real-Time Notifications
Uses Socket.IO to notify employees to check-out after a custom duration.
Admins can change notification timer from the dashboard (commented out CronSettings.jsx on AdminDashboard.jsx).
Daily email reminders are sent via Nodemailer + Cron if attendance is not marked.

## Charts & Reports
Admins get employee vs work-hours graphs by day, range, or all-time.
Employees get monthly attendance table + daily hours bar chart.

## Authentication & Roles
JWT-based login
Role-based UI rendering (Admin vs Employee)
Protected routes via custom middleware and frontend guards

## TODOs & Enhancements
Email templates with better design
Notifications on mobile (PWA)
Offline support (cache check-ins)

