const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbconfig");

const User = sequelize.define("User", {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  }
}, {
  timestamps: false,  // disable timestamps if not needed
});

module.exports = { User };
