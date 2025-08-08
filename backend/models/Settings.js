// models/Settings.js
import { DataTypes, Model } from 'sequelize';

export default class Settings extends Model {
    static init(sequelize) {
        return super.init({
            key: {
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false,
            },
            value: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Settings',
            tableName: 'settings',
            timestamps: true,
        })
    }
};
