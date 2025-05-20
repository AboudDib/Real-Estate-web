const { DataTypes } = require('sequelize');
const db = require('../config/dbconfig');
const { Property } = require("./property");

const PropertyModel = db.define('PropertyModel', {
  model_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  property_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Property,
      key: "property_id",  // Foreign key references the primary key of Property model
    },
    onDelete: 'CASCADE',
  },
  model_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

PropertyModel.belongsTo(Property, { foreignKey: 'property_id', onDelete: 'CASCADE' });

module.exports = { PropertyModel };
