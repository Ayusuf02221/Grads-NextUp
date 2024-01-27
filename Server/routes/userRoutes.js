const express = require('express');
const axios = require('axios');
const router = express.Router();
const { isAuthenticated } = require('../middleware/authMiddleware');
const { validateUserUpdate, handleValidationErrors } = require('../middleware/validation');

// Define the base URL for the API Gateway
const apiGatewayBaseUrl = 'https://kx9fh5reul.execute-api.eu-west-2.amazonaws.com/default'; // Replace with your API Gateway URL

// Direct API Call to AWS Lambda to get a user profile
router.get('/:userId', isAuthenticated, async (req, res) => {
    try {
        const response = await axios.get(`https://kx9fh5reul.execute-api.eu-west-2.amazonaws.com/default/getUserProfile/${req.params.userId}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Direct API Call to AWS Lambda to update a user profile
router.put('/:userId', isAuthenticated, validateUserUpdate, handleValidationErrors, async (req, res) => {
    try {
        const response = await axios.put(`https://kx9fh5reul.execute-api.eu-west-2.amazonaws.com/default/updateUserProfile/${req.params.userId}`, req.body);
        res.json(response.data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Add additional routes as needed, following the same pattern

module.exports = router;
