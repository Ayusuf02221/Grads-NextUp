// User.js
const AWS = require('../config/aws');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'Users';

// Create a new user with default preferences
exports.createUser = async (userData) => {
    const defaultPreferences = {
        notifications: true,
        theme: 'light',
        // ... other default preferences ...
    };

    const params = {
        TableName: TABLE_NAME,
        Item: {
            ...userData,
            createdAt: new Date().toISOString(),
            preferences: userData.preferences || defaultPreferences
        }
    };
    return dynamoDb.put(params).promise();
};

// Update user preferences
exports.updatePreferences = async (userId, preferences) => {
    const params = {
        TableName: TABLE_NAME,
        Key: { userId },
        UpdateExpression: 'set preferences = :preferences',
        ExpressionAttributeValues: {
            ':preferences': preferences
        }
    };
    return dynamoDb.update(params).promise();
};


// Get a user by userId
exports.getUserById = async (userId) => {
    const params = {
        TableName: TABLE_NAME,
        Key: { userId }
    };
    try {
        const data = await dynamoDb.get(params).promise();
        return data.Item; // Return the found user item
    } catch (error) {
        console.error("Error getting user by ID:", error);
        throw new Error('Unable to retrieve user');
    }
};

// Update a user's last login
exports.updateLastLogin = async (userId) => {
    const now = new Date().toISOString();
    const params = {
        TableName: TABLE_NAME,
        Key: { userId },
        UpdateExpression: 'set lastLogin = :now',
        ExpressionAttributeValues: {
            ':now': now
        },
        ReturnValues: 'UPDATED_NEW' // Returns the new value of the updated attribute (lastLogin)
    };
    try {
        const data = await dynamoDb.update(params).promise();
        return data.Attributes.lastLogin; // Return the updated last login timestamp
    } catch (error) {
        console.error("Error updating last login:", error);
        throw new Error('Unable to update last login');
    }
};

// Get user favorites
exports.getUserFavorites = async (userId) => {
    const params = {
        TableName: 'UserFavorites', // Assuming a separate table for favorites
        Key: {
            userId
        }
    };
    return dynamoDb.get(params).promise();
};

// ... Additional methods as needed based on project goals ...
