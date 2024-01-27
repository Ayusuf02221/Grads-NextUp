const AWS = require('../config/aws');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'Projects';

// Utility function for validation
const validateProject = (projectData) => {
    const requiredFields = ['title', 'description']; // Add more required fields as needed
    for (let field of requiredFields) {
        if (!projectData[field]) {
            throw new Error(`Missing required field: ${field}`);
        }
    }
    // Additional validation logic can be added here
};

// Create a new project with additional attributes
exports.createProject = async (projectData) => {
    validateProject(projectData);

    const params = {
        TableName: TABLE_NAME,
        Item: {
            ...projectData,
            projectId: AWS.util.uuid.v4(),
            createdAt: new Date().toISOString(),
            deadline: projectData.deadline || null,
            status: projectData.status || 'Active',
            tags: projectData.tags || [],
        }
    };
    return dynamoDb.put(params).promise();
};

// Get a project by projectId
exports.getProjectById = async (projectId) => {
    const params = {
        TableName: TABLE_NAME,
        Key: { projectId }
    };
    return dynamoDb.get(params).promise();
};

// Update a project
exports.updateProject = async (projectId, updates) => {
    const updateExpression = Object.keys(updates).map(key => `${key} = :${key}`);
    const expressionAttributeValues = {};
    for (let [key, value] of Object.entries(updates)) {
        expressionAttributeValues[`:${key}`] = value;
    }

    const params = {
        TableName: TABLE_NAME,
        Key: { projectId },
        UpdateExpression: 'set ' + updateExpression.join(', '),
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'UPDATED_NEW'
    };
    return dynamoDb.update(params).promise();
};

// Delete a project
exports.deleteProject = async (projectId) => {
    const params = {
        TableName: TABLE_NAME,
        Key: { projectId }
    };
    return dynamoDb.delete(params).promise();
};

// Enhanced listProjects with pagination and advanced querying
exports.listProjects = async (queryParams) => {
    const { userId, status, limit, lastEvaluatedKey } = queryParams;
    let filterExpressions = [];
    let expressionAttributeValues = {};

    if (userId) {
        filterExpressions.push(`userId = :userId`);
        expressionAttributeValues[':userId'] = userId;
    }
    if (status) {
        filterExpressions.push(`status = :status`);
        expressionAttributeValues[':status'] = status;
    }

    const params = {
        TableName: TABLE_NAME,
        FilterExpression: filterExpressions.join(' and '),
        ExpressionAttributeValues: expressionAttributeValues,
        Limit: limit,
        ExclusiveStartKey: lastEvaluatedKey ? JSON.parse(decodeURIComponent(lastEvaluatedKey)) : null,
    };

    return dynamoDb.scan(params).promise();
};

module.exports = {
    createProject,
    getProjectById,
    updateProject,
    deleteProject,
    listProjects
};
