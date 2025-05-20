const { Sequelize } = require("sequelize");
require("dotenv").config();  // Load environment variables from .env file

// Use the environment variables for database configuration
const sequelize = new Sequelize({
  host: process.env.DB_HOST,  // Database host
  username: process.env.DB_USER,  // Database username
  password: process.env.DB_PASS,  // Database password
  database: process.env.DB_NAME,  // Database name
  port: process.env.DB_PORT,  // Database port
  dialect: "mysql",  // MySQL dialect for Sequelize
  logging: false,    // Disable logging (optional)
});

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log("Database connection established successfully.");
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

module.exports = sequelize;
