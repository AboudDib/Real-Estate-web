/*
  RealEstateSignupPage Component

  This React functional component renders a user signup form for a real estate web application.
  It uses Material-UI components for layout and styling, and React Router for navigation.

  Features and behaviors:
  - Form fields: First Name, Last Name, Email, Phone Number, Password.
  - Password input includes a toggle to show/hide the password.
  - Client-side validation before submitting:
    * First and last names must not be empty.
    * Email must match a simple regex pattern.
    * Phone number must be exactly 8 digits.
    * Password must be at least 6 characters long.
  - Displays validation error messages under each relevant field.
  - Shows a general error alert if the server returns an error (e.g., user already exists).
  - On successful signup (HTTP 201 response):
    * Displays a success message with a green check icon.
    * Stores user data and authentication token in localStorage.
    * Redirects the user to the login page after a short delay.
  - Uses a loading spinner inside the submit button while waiting for the API response.
  - Background image and centered layout create an attractive, responsive signup page.
  - Navigation link to the login page for existing users.

  External dependencies:
  - UserService.register(): API call to register a new user.
  - react-router-dom's useNavigate for programmatic navigation.
  - imageLinks.HomeBckg for background image URL.

  Component state:
  - formData: Object holding all form input values.
  - showPassword: Boolean toggle for password visibility.
  - error: Object storing validation errors and general API errors.
  - loading: Boolean to show loading spinner during API call.
  - success: Boolean to display a success message on successful registration.

  Overall, this component provides a user-friendly, validated signup form 
  with clear feedback and smooth navigation flow.
*/

import React, { useState } from 'react';
import { Box, Grid, TextField, Button, Typography, IconButton, InputAdornment, Paper, CircularProgress, Alert } from '@mui/material';
import { Visibility, VisibilityOff, CheckCircle } from '@mui/icons-material';
import UserService from "../services/UserService.js";
import { Link, useNavigate } from 'react-router-dom';
import imageLinks from '../assets/ImageLinks.js';

const RealEstateSignupPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        let isValid = true;
        const errorMessages = {};

        if (formData.firstName.trim() === '') {
            errorMessages.firstName = 'First name is required';
            isValid = false;
        }

        if (formData.lastName.trim() === '') {
            errorMessages.lastName = 'Last name is required';
            isValid = false;
        }

        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(formData.email)) {
            errorMessages.email = 'Please enter a valid email';
            isValid = false;
        }

        const phonePattern = /^[0-9]{8}$/;
        if (!phonePattern.test(formData.phone)) {
            errorMessages.phone = 'Please enter a valid phone number';
            isValid = false;
        }

        if (formData.password.length < 6) {
            errorMessages.password = 'Password must be at least 6 characters';
            isValid = false;
        }

        setError(errorMessages);
        return isValid;
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSignup = async (event) => {
        event.preventDefault();

        if (validateForm()) {
            setLoading(true);
            const requestData = {
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                password: formData.password,
                phone_number: formData.phone,
            };

            const result = await UserService.register(requestData);
            console.log('API result:', result);
            setLoading(false);

            // Check if the result is successful
            if (result?.status === 201) {
                setSuccess(true); // Show success message
                localStorage.setItem("user", JSON.stringify(result.data.user));
                localStorage.setItem("token", result.data.token);
                setTimeout(() => navigate("/Login"), 2000);
            } else {
                // Error handling, if user already exists or other errors
                const errorMessage = result?.data?.error || "Something went wrong";
                setError({ general: errorMessage });
            }
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <Box
            sx={{
                height: '100vh',
                width: '100vw',
                backgroundImage: `url(${imageLinks.HomeBckg})`,

                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Grid container justifyContent="center">
                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={5} sx={{ padding: 4, borderRadius: '12px', textAlign: 'center' }}>
                        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', fontFamily: 'Arial, sans-serif' }}>Sign Up</Typography>
                        <Typography variant="body2" sx={{ mb: 3, color: 'gray' }}>Create your account</Typography>
                        <form onSubmit={handleSignup}>
                            {/* Display General Error */}
                            {error.general && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {error.general}
                                </Alert>
                            )}

                            <TextField
                                fullWidth
                                label="First Name"
                                variant="standard"
                                margin="normal"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                error={!!error.firstName}
                                helperText={error.firstName}
                            />
                            <TextField
                                fullWidth
                                label="Last Name"
                                variant="standard"
                                margin="normal"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                error={!!error.lastName}
                                helperText={error.lastName}
                            />
                            <TextField
                                fullWidth
                                label="Email"
                                variant="standard"
                                margin="normal"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                error={!!error.email}
                                helperText={error.email}
                            />
                            <TextField
                                fullWidth
                                label="Phone Number"
                                variant="standard"
                                margin="normal"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                error={!!error.phone}
                                helperText={error.phone}
                            />
                            <TextField
                                fullWidth
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                variant="standard"
                                margin="normal"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                error={!!error.password}
                                helperText={error.password}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={togglePasswordVisibility}>
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            {success && (
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <CheckCircle sx={{ marginRight: 1, color: 'green' }} />
                                    <Typography variant="body2" sx={{ color: 'green' }}>
                                        User created successfully!
                                    </Typography>
                                </Box>
                            )}

                            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
                            </Button>
                        </form>
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body2">
                                Already have an account?{' '}
                                <Link to="/login" style={{ color: '#3B82F6' }}>
                                    Log In
                                </Link>
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default RealEstateSignupPage;
