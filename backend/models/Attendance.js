import { DataTypes, Model } from 'sequelize';

export default class Attendance extends Model {
    static init(sequelize) {
        return super.init(
            {
                date: {
                    type: DataTypes.DATEONLY,
                    allowNull: false,
                },
                checkInTime: {
                    type: DataTypes.TIME,
                    allowNull: false,
                },
                checkOutTime: {
                    type: DataTypes.TIME,
                    allowNull: true,
                },
                workHours: {
                    type: DataTypes.FLOAT,
                    allowNull: true,
                },
                employeeId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                createdBy: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                updatedBy: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                lastUpdatedTimestamp: {
                    type: DataTypes.DATE,
                    defaultValue: DataTypes.NOW,
                },
            },
            {
                sequelize,
                modelName: 'Attendance',
                tableName: 'attendance',
                timestamps: true,
            }
        );
    }

    static associate(models) {
        this.belongsTo(models.User, {
            foreignKey: 'employeeId',
            as: 'employee',
        });

        this.belongsTo(models.User, {
            foreignKey: 'createdBy',
            as: 'creator',
        });

        this.belongsTo(models.User, {
            foreignKey: 'updatedBy',
            as: 'updater',
        });
    }
}
