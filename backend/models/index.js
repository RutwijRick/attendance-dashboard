import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

import User from './User.js';
import Attendance from './Attendance.js';
import Settings from './Settings.js';

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false,
    }
);

// Init models
const models = {
    User: User.init(sequelize),
    Attendance: Attendance.init(sequelize),
    Settings: Settings.init(sequelize),
};

// Define associations
Object.values(models).forEach(model => {
    if (model.associate) {
        model.associate(models);
    }
});

export { sequelize };
export default models;
