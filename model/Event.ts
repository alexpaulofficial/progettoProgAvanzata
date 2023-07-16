import { SequelizeSingleton } from "./Database";
import { DataTypes, Sequelize } from 'sequelize';

const sequelize: Sequelize = SequelizeSingleton.getConnection();

export const Event = sequelize.define('event', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    owner: {
        type: DataTypes.STRING,
        validate: { isEmail: true },
        allowNull: false
    },
    mode: {
        type: DataTypes.TINYINT,
        validate: {
            min: 1,
            max: 3
        },
        allowNull: false
    },
    datetimes: {
        type: DataTypes.ARRAY(DataTypes.DATE),
        defaultValue: DataTypes.NOW,
        validate: { isDate: true },
        allowNull: false
    },
    status: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: { min: 0, max: 1 },
        defaultValue: 1
    },
    latitude: {
        type: DataTypes.FLOAT,
        validate: { min: -90, max: 90 },
        defaultValue: null
    },
    longitude: {
        type: DataTypes.FLOAT,
        validate: { min: -180, max: 180 },
        defaultValue: null
    },
    link: {
        type: DataTypes.STRING,
        validate: { isUrl: true },
        defaultValue: null
    },
    bookings: {
        type: DataTypes.JSONB,
        allowNull: true
    },
}, {
    modelName: 'event',
    timestamps: false,
    freezeTableName: true

});