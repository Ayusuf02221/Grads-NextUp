const AWS = require('../config/aws');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const INTERVIEWS_TABLE = 'Interviews';
const { isAuthenticated, isAuthorized } = require('../middleware/auth');
const validateInterview = require('../middleware/validateInterview');
const { log, handleError } = require('../utils/logger');
const { handleDynamoError } = require('../utils/errorHandler');

// List interviews for a user based on type (behavioral, technical, etc.)
exports.listUserInterviewsByType = [
    isAuthenticated,
    async (req, res) => {
        const { userId, interviewType } = req.query;
        if (req.user.id !== userId && !req.user.isAdmin) {
            return res.status(403).json({ error: "Unauthorized access to interviews." });
        }

        let params = {
            TableName: INTERVIEWS_TABLE,
            IndexName: 'UserIdAndTypeIndex',
            KeyConditionExpression: 'userId = :userId and interviewType = :type',
            ExpressionAttributeValues: { ':userId': userId, ':type': interviewType }
        };

        try {
            const data = await dynamoDb.query(params).promise();
            res.json(data.Items);
            log('info', `Interviews listed for user: ${userId} of type ${interviewType}`);
        } catch (error) {
            handleDynamoError(res, error, 'Failed to list interviews.');
        }
    }
];

// Add new interview experience
exports.addInterviewExperience = [
    isAuthenticated,
    isAuthorized('addInterview'),
    validateInterview,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const { company, role, interviewType, experience, date } = req.body;
        const userId = req.user.id;

        const params = {
            TableName: INTERVIEWS_TABLE,
            Item: {
                interviewId: uuidv4(),
                userId,
                company,
                role,
                interviewType,
                experience,
                date
            }
        };

        try {
            await dynamoDb.put(params).promise();
            res.status(201).json({ message: "Interview experience added successfully", experience: params.Item });
            log('info', `Interview experience added for user: ${userId}`);
        } catch (error) {
            handleDynamoError(res, error, 'Failed to add interview experience.');
        }
    }
];

// Update interview experience
exports.updateInterviewExperience = [
    isAuthenticated,
    isAuthorized('updateInterview'),
    async (req, res) => {
        const { interviewId } = req.params;
        const updates = req.body;

        const updateExpression = Object.keys(updates).map(key => `${key} = :${key}`);
        const expressionAttributeValues = {};
        for (let [key, value] of Object.entries(updates)) {
            expressionAttributeValues[`:${key}`] = value;
        }

        const params = {
            TableName: INTERVIEWS_TABLE,
            Key: { interviewId },
            UpdateExpression: 'set ' + updateExpression.join(', '),
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'UPDATED_NEW'
        };

        try {
            const data = await dynamoDb.update(params).promise();
            res.status(200).json({ message: "Interview experience updated successfully", updatedAttributes: data.Attributes });
            log('info', `Interview experience updated for ID: ${interviewId}`);
        } catch (error) {
            handleDynamoError(res, error, 'Failed to update interview experience.');
        }
    }
];

// Add other interview management methods as needed...
