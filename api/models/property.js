const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbconfig");
const { User } = require("./user"); // Importing User model

const Property = sequelize.define("Property", {
  property_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "user_id", // Foreign key references User model
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT, // Changed to TEXT for longer descriptions
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  property_type: {
    type: DataTypes.ENUM("apartment", "villa"), // Replaced 'house' and 'land' with 'apartment' and 'villa'
    allowNull: false,
  },
  square_meter: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isNumeric: true,
    },
  },
  bedrooms: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  bathrooms: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  living_rooms: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 1, // Most properties have at least one living room
    validate: {
      min: 0,
    },
  },
  balconies: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0, // Some properties might not have balconies
    validate: {
      min: 0,
    },
  },
  parking_spaces: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0, // Some properties might not have parking
    validate: {
      min: 0,
    },
  },
  furnished: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false, // Assume unfurnished unless specified
  },
  year_built: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1800, // Just to be safe from weird data
      max: new Date().getFullYear(),
    },
  },
  
  isForRent: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  isApproved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // Default to false, requiring approval
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: false,
});

// Define associations
Property.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });
User.hasMany(Property, { foreignKey: "user_id" });

module.exports = { Property };
