const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbconfig");
const { Property } = require("./property");  // Destructure to access Property model

const PropertyImage = sequelize.define("PropertyImage", {
  image_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  property_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Property,
      key: "property_id",  // Foreign key references the primary key of Property model
    },
  },
}, {
  timestamps: false,
});

// Define associations
PropertyImage.belongsTo(Property, { foreignKey: 'property_id' , onDelete: 'CASCADE' });
Property.hasMany(PropertyImage, { foreignKey: 'property_id' });

module.exports = { PropertyImage };
