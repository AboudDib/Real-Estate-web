const sequelize = require("./dbconfig");  // Import the sequelize instance
const { User, Property, Transaction, PropertyImage } = require("./models");  // Import your models

// Sync all models with the database
sequelize.sync({ force: false })  // Use force: true to drop and recreate tables (caution)
  .then(() => {
    console.log("Database synced successfully.");
  })
  .catch((error) => {
    console.error("Error syncing the database:", error);
  });
