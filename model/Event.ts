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
        allowNull: false
    },
    mode: {
        type: DataTypes.TINYINT,
        allowNull: false
    },
    datetimes: {
        type: DataTypes.ARRAY(DataTypes.DATE),
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
    status: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1
    },
    latitude: {
        type: DataTypes.FLOAT,
        defaultValue: null
    },
    longitude: {
        type: DataTypes.FLOAT,
        defaultValue: null
    },
    link: {
        type: DataTypes.STRING,
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