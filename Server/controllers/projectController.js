const AWS = require('../config/aws');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const { isAuthenticated, isAuthorized } = require('../middleware/auth');
const validateProject = require('../middleware/validateProject');
const { log, handleError } = require('../utils/logger');
const { handleDynamoError } = require('../utils/errorHandler');

// List projects by difficulty with pagination
exports.listProjects = async (req, res) => {
    const { difficulty, lastEvaluatedKey, userId } = req.query;

    let params = {
        TableName: 'Projects',
        IndexName: 'DifficultyIndex',
        KeyConditionExpression: 'difficulty = :difficulty',
        ExpressionAttributeValues: { ':difficulty': difficulty },
        ExclusiveStartKey: lastEvaluatedKey ? JSON.parse(decodeURIComponent(lastEvaluatedKey)) : undefined,
        Limit: 20,
    };

    if (userId && !req.user.isAdmin) {
        params.FilterExpression = 'userId = :userId';
        params.ExpressionAttributeValues[':userId'] = userId;
    }

    try {
        const data = await dynamoDb.query(params).promise();
        res.json({
            items: data.Items,
            lastEvaluatedKey: data.LastEvaluatedKey,
        });
        log('info', `Projects listed for difficulty: ${difficulty}`);
    } catch (error) {
        handleDynamoError(res, error, 'Failed to list projects.');
    }
};

// Create a new project
exports.createProject = [
    isAuthenticated,
    isAuthorized('createProject'),
    validateProject,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const { title, description, deadline, status } = req.body;
        const userId = req.user.id;

        const params = {
            TableName: 'Projects',
            Item: {
                projectId: uuidv4(),
                userId,
                title,
                description,
                deadline,
                status,
                createdAt: new Date().toISOString(),
            }
        };

        try {
            await dynamoDb.put(params).promise();
            res.status(201).json({ message: "Project created successfully", project: params.Item });
            log('info', `Project created for user: ${userId}`);
        } catch (error) {
            handleDynamoError(res, error, 'Failed to create project.');
        }
    }
];

// Update a project
exports.updateProject = [
    isAuthenticated,
    isAuthorized('updateProject'),
    async (req, res) => {
        const { projectId } = req.params;
        const updates = req.body;

        const updateExpression = Object.keys(updates).map(key => `${key} = :${key}`);
        const expressionAttributeValues = {};
        for (let [key, value] of Object.entries(updates)) {
            expressionAttributeValues[`:${key}`] = value;
        }

        const params = {
            TableName: 'Projects',
            Key: { projectId },
            UpdateExpression: 'set ' + updateExpression.join(', '),
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'UPDATED_NEW'
        };

        try {
            const data = await dynamoDb.update(params).promise();
            res.status(200).json({ message: "Project updated successfully", updatedAttributes: data.Attributes });
            log('info', `Project updated for ID: ${projectId}`);
        } catch (error) {
            handleDynamoError(res, error, 'Failed to update project.');
        }
    }
];

// Delete a project
exports.deleteProject = [
    isAuthenticated,
    isAuthorized('deleteProject'),
    async (req, res) => {
        const { projectId } = req.params;

        const params = {
            TableName: 'Projects',
            Key: { projectId },
        };

        try {
            await dynamoDb.delete(params).promise();
            res.status(200).json({ message: "Project deleted successfully" });
            log('info', `Project deleted with ID: ${projectId}`);
        } catch (error) {
            handleDynamoError(res, error, 'Failed to delete project.');
        }
    }
];

// Add other project management methods as needed...
