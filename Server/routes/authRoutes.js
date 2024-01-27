const express = require('express');
const axios = require('axios');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { handleValidationError } = require('../utils/errorHandler');

// Define the base URL for the API Gateway
const apiGatewayBaseUrl = 'https://q6xyacf95e.execute-api.eu-west-2.amazonaws.com/default'; // Replace with your API Gateway URL

// Rate limiting middleware for login route
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10 // Limit each IP to 10 login requests per windowMs
});

// Direct API Call to AWS Lambda for registration
router.post('/register', handleValidationError, async (req, res) => {
    console.log('Received POST request to /register');
    try {
        const response = await axios.post(`${apiGatewayBaseUrl}/register`, req.body);
        console.log('Response from /register:', response.data);
        res.json(response.data);
    } catch (error) {
        console.error('Error in /register:', error);
        res.status(500).send(error.message);
    }
});



// Direct API Call to AWS Lambda for login
router.post('/login', loginRateLimiter, handleValidationError, async (req, res) => {
    console.log('Received POST request to /login');
    try {
        const response = await axios.post(`${apiGatewayBaseUrl}/login`, req.body);
        console.log('Response from /login:', response.data);
        res.json(response.data);
    } catch (error) {
        console.error('Error in /login:', error);
        res.status(500).send(error.message);
    }
});

// Direct API Call to AWS Lambda for forgot password
router.post('/forgot-password', handleValidationError, async (req, res) => {
    console.log('Received POST request to /forgot-password');
    try {
        const response = await axios.post(`${apiGatewayBaseUrl}/forgotPassword`, req.body);
        console.log('Response from /forgot-password:', response.data);
        res.json(response.data);
    } catch (error) {
        console.error('Error in /forgot-password:', error);
        res.status(500).send(error.message);
    }
});

// Direct API Call to AWS Lambda for reset password
router.post('/reset-password', handleValidationError, async (req, res) => {
    console.log('Received POST request to /reset-password');
    try {
        const response = await axios.post(`${apiGatewayBaseUrl}/confirmNewPassword`, req.body);
        console.log('Response from /reset-password:', response.data);
        res.json(response.data);
    } catch (error) {
        console.error('Error in /reset-password:', error);
        res.status(500).send(error.message);
    }
});

// Direct API Call to AWS Lambda for verify email
router.post('/verify-email', handleValidationError, async (req, res) => {
    console.log('Received POST request to /verify-email');
    try {
        const response = await axios.post(`${apiGatewayBaseUrl}/verifyEmail`, req.body);
        console.log('Response from /verify-email:', response.data);
        res.json(response.data);
    } catch (error) {
        console.error('Error in /verify-email:', error);
        res.status(500).send(error.message);
    }
});

module.exports = router;
