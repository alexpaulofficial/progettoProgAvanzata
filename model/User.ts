import { SequelizeSingleton } from "./Database";
import { DataTypes, Sequelize } from 'sequelize';

const sequelize: Sequelize = SequelizeSingleton.getConnection();

export const User = sequelize.define('user', {
  email: {
      type: DataTypes.STRING,
      primaryKey: true,
      autoIncrement: true
  },
  name: {
      type: DataTypes.STRING,
      allowNull: false
  },
  surname: {
      type: DataTypes.STRING,
      allowNull: false
  },
  role: {
      type: DataTypes.STRING,
      allowNull: false
  },
  token: {
      type: DataTypes.INTEGER,
      allowNull: false
  }
}, 
{
  modelName: 'user',
  timestamps: false,
  freezeTableName: true
});
