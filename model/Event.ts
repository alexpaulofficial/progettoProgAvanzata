import { SequelizeSingleton } from "./Database";
import { DataTypes, Sequelize } from 'sequelize';

// Viene richiamato il singleton per la connessione al DB
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
        // Verifica che l'email sia valida
        validate: { isEmail: true },
        allowNull: false
    },
    mode: {
        type: DataTypes.TINYINT,
        // Viene eseguito un controllo sul valore inserito anche qui oltre che nel controller
        validate: {
            min: 1,
            max: 3
        },
        allowNull: false
    },
    datetimes: {
        // Postgres ha una gestione avanzata delle date, quindi viene usato il tipo DATE
        type: DataTypes.ARRAY(DataTypes.DATE),
        defaultValue: DataTypes.ARRAY(DataTypes.NOW),
        allowNull: false
    },
    status: {
        type: DataTypes.TINYINT,
        allowNull: false,
        // Viene eseguito un controllo sul valore inserito anche qui oltre che nel controller
        validate: { min: 0, max: 1 },
        defaultValue: 1
    },
    latitude: {
        type: DataTypes.FLOAT,
        // Viene eseguito un controllo sul valore inserito anche qui oltre che nel controller
        validate: { min: -90, max: 90 },
        defaultValue: null
    },
    longitude: {
        type: DataTypes.FLOAT,
        // Viene eseguito un controllo sul valore inserito anche qui oltre che nel controller
        validate: { min: -180, max: 180 },
        defaultValue: null
    },
    link: {
        type: DataTypes.STRING,
        // Verifica che l'url sia valido
        validate: { isUrl: true },
        defaultValue: null
    },
    bookings: {
        // Postgres gestisce i JSONB come se fossero JSON ma con un indice aggiuntivo per velocizzare le ricerche
        type: DataTypes.JSONB,
        allowNull: true
    },
}, {
    modelName: 'event',
    timestamps: false,
    freezeTableName: true

});