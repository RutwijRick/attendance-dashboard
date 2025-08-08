import bcrypt from 'bcrypt';
import models, { sequelize } from '../models/index.js';

const seed = async () => {
    try {
        await sequelize.sync({ alter: true });

        const passwordHash1 = await bcrypt.hash('adminpass', 10);
        const passwordHash2 = await bcrypt.hash('employeepass', 10);

        await models.User.bulkCreate([
            {
                name: 'Admin User',
                username: 'admin123',
                password: passwordHash1,
                role: 1,
            },
            {
                name: 'Employee User',
                username: 'employee123',
                password: passwordHash2,
                role: 2,
            },
        ]);

        console.log('Users seeded.');
        process.exit();
    } catch (err) {
        console.error('Seed failed:', err);
        process.exit(1);
    }
};

seed();
