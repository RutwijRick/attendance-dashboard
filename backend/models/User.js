import { DataTypes, Model } from 'sequelize';

export default class User extends Model {
    static init(sequelize) {
        return super.init(
            {
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                username: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: true,
                },
                password: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                role: {
                    type: DataTypes.INTEGER, // 1 = Admin, 2 = Employee
                    allowNull: false,
                },
            },
            {
                sequelize,
                modelName: 'User',
                tableName: 'users',
                timestamps: true,
            }
        );
    }

    static associate(models) {
        this.hasMany(models.Attendance, {
            foreignKey: 'employeeId',
            as: 'attendances',
        });

        this.hasMany(models.Attendance, {
            foreignKey: 'createdBy',
            as: 'createdAttendances',
        });

        this.hasMany(models.Attendance, {
            foreignKey: 'updatedBy',
            as: 'updatedAttendances',
        });
    }
}
