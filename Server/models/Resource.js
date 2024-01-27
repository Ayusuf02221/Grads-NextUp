// Resource.js
const AWS = require('../config/aws');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'Resources';

// Create a new resource
exports.createResource = async (resourceData) => {
    const params = {
        TableName: TABLE_NAME,
        Item: resourceData
    };

    try {
        await dynamoDb.put(params).promise();
        return { message: "Resource created successfully", resource: resourceData };
    } catch (error) {
        console.error("Error creating resource:", error);
        throw new Error('Unable to create resource');
    }
};

// Get a resource by ID
exports.getResourceById = async (resourceId) => {
    const params = {
        TableName: TABLE_NAME,
        Key: { resourceId }
    };

    try {
        const data = await dynamoDb.get(params).promise();
        if (!data.Item) {
            throw new Error('Resource not found');
        }
        return data.Item;
    } catch (error) {
        console.error("Error retrieving resource:", error);
        throw new Error('Unable to retrieve resource');
    }
};

// List resources with filtering and sorting
exports.listResources = async (filters) => {
    let filterExpressions = [];
    let expressionAttributeValues = {};

    for (const [key, value] of Object.entries(filters)) {
        if (Array.isArray(value)) {
            // Handle array filters (e.g., multi-select)
            filterExpressions.push(`(${value.map((val, idx) => `${key} = :${key}${idx}`).join(' or ')})`);
            value.forEach((val, idx) => {
                expressionAttributeValues[`:${key}${idx}`] = val;
            });
        } else {
            // Handle single value filters
            filterExpressions.push(`${key} = :${key}`);
            expressionAttributeValues[`:${key}`] = value;
        }
    }

    // Special handling for interviewPrep filter
    if ('interviewPrep' in filters) {
        filterExpressions.push(`interviewPrep = :interviewPrep`);
        expressionAttributeValues[':interviewPrep'] = filters.interviewPrep;
    }

    const params = {
        TableName: TABLE_NAME,
        FilterExpression: filterExpressions.join(' and '),
        ExpressionAttributeValues: expressionAttributeValues,
    };

    try {
        const data = await dynamoDb.scan(params).promise();
        return data.Items;
    } catch (error) {
        console.error("Error listing resources:", error);
        throw new Error('Unable to list resources: ' + error.message);
    }
};


// Update a resource
exports.updateResource = async (resourceId, updates) => {
    const updateExpression = Object.keys(updates).map(key => `${key} = :${key}`);
    const expressionAttributeValues = {};

    for (let [key, value] of Object.entries(updates)) {
        expressionAttributeValues[`:${key}`] = value;
    }

    const params = {
        TableName: TABLE_NAME,
        Key: { resourceId },
        UpdateExpression: 'set ' + updateExpression.join(', '),
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'UPDATED_NEW'
    };

    try {
        const data = await dynamoDb.update(params).promise();
        return data.Attributes;
    } catch (error) {
        console.error("Error updating resource:", error);
        throw new Error('Unable to update resource: ' + error.message);
    }
};
// Delete a resource
exports.deleteResource = async (resourceId) => {
    const params = {
        TableName: TABLE_NAME,
        Key: { resourceId }
    };

    try {
        await dynamoDb.delete(params).promise();
        return { message: "Resource deleted successfully" };
    } catch (error) {
        console.error("Error deleting resource:", error);
        throw new Error('Unable to delete resource: ' + error.message);
    }
};

