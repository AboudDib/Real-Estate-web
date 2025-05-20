require("dotenv").config();  // Load environment variables from .env file
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./config/dbconfig");  // Sequelize DB configuration

// Import models
const { User } = require("./models/user");
const { Property } = require("./models/property");
const { PropertyImage } = require("./models/propertyImage");  // Correct model name
const { PropertyModel } = require("./models/propertyModel"); // Import PropertyModel


const app = express();
const port = process.env.PORT || 3001;  // Default to port 3001 if not provided in .env

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Use the machine learning route
const machineLearningRoutes = require('./routes/mlRoutes');  // Adjust the path if necessary
app.use('/api/ml', machineLearningRoutes);

// Routes setup
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

const propertyRoutes = require('./routes/propertyRoutes');
app.use('/api/property', propertyRoutes);

// Add PropertyModel route here
const propertyImageRoutes = require('./routes/propertyImageRoutes');  // Import the property model routes
app.use('/api/property-images', propertyImageRoutes);  // Add the route for property models

// Add PropertyModel route here
const propertyModelRoutes = require('./routes/propertyModelRoutes');  // Import the property model routes
app.use('/api/property-model', propertyModelRoutes);  // Add the route for property models

// Add PropertyModel route here
const resendRoutes = require('./routes/resendRoutes');  // Import the property model routes
app.use('/api/resend', resendRoutes);  // Add the route for property models


// Database Sync
sequelize
  .sync({ force: false }) // Sync all models, but don't drop tables
  .then(() => {
    console.log("Database has been synchronized successfully.");
  })
  .catch((err) => {
    console.error("Error syncing the database:", err);
  });

// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
