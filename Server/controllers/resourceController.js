const AWS = require('../config/aws');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const { validationResult } = require('express-validator');
const { isAuthenticated, isAuthorized } = require('../middleware/auth');
const validateResource = require('../middleware/validateResource');
const { log, handleError } = require('../utils/logger');
const { handleDynamoError } = require('../utils/errorHandler');

// List all resources or filter by topic and difficulty with advanced filtering
exports.listResources = async (req, res) => {
    const { topic, difficulty, page, limit } = req.query;

    let params = {
        TableName: 'Resources',
        IndexName: 'TopicDifficultyIndex',
        KeyConditionExpression: 'topic = :t and difficulty = :d',
        ExpressionAttributeValues: { ':t': topic, ':d': difficulty },
        Limit: limit || 10,
        ExclusiveStartKey: page || null,
    };

    try {
        const data = await dynamoDb.query(params).promise();
        res.json({
            items: data.Items,
            lastEvaluatedKey: data.LastEvaluatedKey,
        });
        log('info', `Resources listed with topic: ${topic} and difficulty: ${difficulty}`);
    } catch (error) {
        handleDynamoError(res, error, 'Failed to list resources.');
    }
};

// Add a new resource
exports.addResource = [
    isAuthenticated,
    isAuthorized('createResource'),
    validateResource,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const { title, url, description, topic, difficulty } = req.body;

        const params = {
            TableName: 'Resources',
            Item: {
                resourceId: uuidv4(),
                title,
                url,
                description,
                topic,
                difficulty,
                createdAt: new Date().toISOString(),
            }
        };

        try {
            await dynamoDb.put(params).promise();
            res.status(201).json({ message: "Resource added successfully", resource: params.Item });
            log('info', `Resource added with title: ${title}`);
        } catch (error) {
            handleDynamoError(res, error, 'Failed to add resource.');
        }
    }
];

// Update an existing resource
exports.updateResource = [
    isAuthenticated,
    isAuthorized('updateResource'),
    async (req, res) => {
        const { resourceId } = req.params;
        const updates = req.body;

        const updateExpression = Object.keys(updates).map(key => `${key} = :${key}`);
        const expressionAttributeValues = {};
        for (let [key, value] of Object.entries(updates)) {
            expressionAttributeValues[`:${key}`] = value;
        }

        const params = {
            TableName: 'Resources',
            Key: { resourceId },
            UpdateExpression: 'set ' + updateExpression.join(', '),
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'UPDATED_NEW'
        };

        try {
            const data = await dynamoDb.update(params).promise();
            res.status(200).json({ message: "Resource updated successfully", updatedAttributes: data.Attributes });
            log('info', `Resource updated with ID: ${resourceId}`);
        } catch (error) {
            handleDynamoError(res, error, 'Failed to update resource.');
        }
    }
];

// Delete a resource
exports.deleteResource = [
    isAuthenticated,
    isAuthorized('deleteResource'),
    async (req, res) => {
        const { resourceId } = req.params;

        const params = {
            TableName: 'Resources',
            Key: { resourceId },
        };

        try {
            await dynamoDb.delete(params).promise();
            res.status(200).json({ message: "Resource deleted successfully" });
            log('info', `Resource deleted with ID: ${resourceId}`);
        } catch (error) {
            handleDynamoError(res, error, 'Failed to delete resource.');
        }
    }
];

// Add other resource management methods as needed...
