// Interview.js
const AWS = require('../config/aws');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const INTERVIEWS_TABLE = 'Interviews'; // Table for storing interview experiences

// Utility function to log and throw errors
function handleError(error, message) {
    console.error(message, error);
    throw new Error(message);
}

// Create a new interview experience
exports.createExperience = async (experienceData) => {
    const params = {
        TableName: INTERVIEWS_TABLE,
        Item: {
            interviewId: experienceData.interviewId, // Unique identifier for the experience
            userId: experienceData.userId, // ID of the user who shared the experience
            company: experienceData.company, // Company where the interview was conducted
            role: experienceData.role, // Role interviewed for
            date: experienceData.date, // Date of the interview
            experience: experienceData.experience, // The actual experience content
            resourcesUsed: experienceData.resourcesUsed, // List of resources used
            createdAt: new Date().toISOString()
        }
    };
    try {
        await dynamoDb.put(params).promise();
    } catch (error) {
        handleError(error, 'Failed to create interview experience.');
    }
};

// Retrieve an experience by interviewId
exports.getExperienceById = async (interviewId) => {
    const params = {
        TableName: INTERVIEWS_TABLE,
        Key: { interviewId }
    };
    try {
        const data = await dynamoDb.get(params).promise();
        return data.Item;
    } catch (error) {
        handleError(error, `Failed to retrieve experience with interviewId ${interviewId}.`);
    }
};

// List experiences for a specific company and type
exports.listExperiencesByCompanyAndType = async (company, type) => {
    // Assuming a GSI on company and type attributes for efficient querying
    const params = {
        TableName: INTERVIEWS_TABLE,
        IndexName: 'CompanyTypeIndex',
        KeyConditionExpression: 'company = :company and type = :type',
        ExpressionAttributeValues: {
            ':company': company,
            ':type': type
        }
    };
    try {
        const data = await dynamoDb.query(params).promise();
        return data.Items;
    } catch (error) {
        handleError(error, `Failed to list experiences for ${company} and type ${type}.`);
    }
};

// Update an interview experience
exports.updateExperience = async (id, updates) => {
    const updateExpression = Object.keys(updates).map(key => `${key} = :${key}`);
    const expressionAttributeValues = {};
    for (let [key, value] of Object.entries(updates)) {
        expressionAttributeValues[`:${key}`] = value;
    }

    const params = {
        TableName: INTERVIEWS_TABLE,
        Key: { id },
        UpdateExpression: 'set ' + updateExpression.join(', '),
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'UPDATED_NEW'
    };

    try {
        const data = await dynamoDb.update(params).promise();
        return data.Attributes;
    } catch (error) {
        handleError(error, `Failed to update experience with ID ${id}.`);
    }
};

// Delete an interview experience
exports.deleteExperience = async (id) => {
    const params = {
        TableName: INTERVIEWS_TABLE,
        Key: { id }
    };
    try {
        await dynamoDb.delete(params).promise();
    } catch (error) {
        handleError(error, `Failed to delete experience with ID ${id}.`);
    }
};

// ... Add additional methods as needed ...
