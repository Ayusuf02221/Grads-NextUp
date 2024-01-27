const AWS = require('../config/aws');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const { validationResult } = require('express-validator');
const { isAuthenticated, isAuthorized } = require('../middleware/auth');
const validateUserProfile = require('../middleware/validateUserProfile');
const { log, handleError } = require('../utils/logger');
const { handleDynamoError, recordChangeHistory } = require('../utils/errorHandler');

// Retrieve user profile
exports.getUserProfile = [
    isAuthenticated,
    async (req, res) => {
        const { userId } = req.params;
        if (req.user.id !== userId) {
            return res.status(403).json({ error: "Unauthorized access to user profile." });
        }

        const params = {
            TableName: 'Users',
            Key: { userId }
        };

        try {
            const data = await dynamoDb.get(params).promise();
            if (data.Item) {
                res.json(data.Item);
                log('info', `User profile retrieved for user: ${userId}`);
            } else {
                res.status(404).json({ message: "User not found" });
            }
        } catch (error) {
            handleDynamoError(res, error, `Failed to retrieve user profile for user: ${userId}.`);
        }
    }
];

// Update user profile
exports.updateUserProfile = [
    isAuthenticated,
    isAuthorized('updateProfile'),
    validateUserProfile,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const { userId } = req.params;
        if (req.user.id !== userId) {
            return res.status(403).json({ error: "Unauthorized access to update profile." });
        }

        const updates = req.body;

        const updateExpression = Object.keys(updates).map(key => `${key} = :${key}`);
        const expressionAttributeValues = {};
        for (let [key, value] of Object.entries(updates)) {
            expressionAttributeValues[`:${key}`] = value;
        }

        const params = {
            TableName: 'Users',
            Key: { userId },
            UpdateExpression: 'set ' + updateExpression.join(', '),
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'UPDATED_NEW'
        };

        try {
            const data = await dynamoDb.update(params).promise();
            await recordChangeHistory(userId, updates);
            res.status(200).json({ message: "User profile updated successfully", updatedAttributes: data.Attributes });
            log('info', `User profile updated for user: ${userId}`);
        } catch (error) {
            handleDynamoError(res, error, `Failed to update user profile for user: ${userId}.`);
        }
    }
];

// Add other user profile management methods as needed...
