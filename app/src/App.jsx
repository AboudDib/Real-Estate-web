import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login";
import SignupPage from "./pages/SignUp";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import UserProperties from "./pages/UserProperties";
import PropertyDetailsPage from "./pages/PropertyDetailsPage";
import Property360ViewerPage from "./pages/Property360ViewerPage"; // Add this import

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Set the default route to the Login page */}
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/adminPanel" element={<AdminPanel />} />
        <Route path="/user-properties" element={<UserProperties />} />
        <Route path="/property-details" element={<PropertyDetailsPage />} />
        <Route path="/properties/:propertyId/360-view" element={<Property360ViewerPage />} />
      </Routes>
    </Router>
  );
};

export default App;