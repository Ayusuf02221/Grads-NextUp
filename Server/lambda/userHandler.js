const dynamoService = require('../services/dynamoService');
const { log } = require('../utils/logger');

const USERS_TABLE = 'Users';

exports.handler = async (event) => {
    try {
        const body = event.body ? JSON.parse(event.body) : null;
        const userId = event.pathParameters ? event.pathParameters.userId : null;

        switch (event.resource) {
            case '/getUserProfile':
                return await getUserProfile(userId);
            case '/updateUserProfile':
                return await updateUserProfile(userId, body);
            case '/deleteUserProfile':
                return await deleteUserProfile(userId);
            // Add other cases if needed
        }
    } catch (error) {
        log('error', error);
        return formatLambdaResponse(500, { error: error.message });
    }
};

async function getUserProfile(userId) {
    const params = {
        TableName: USERS_TABLE,
        Key: { userId }
    };

    const data = await dynamoService.getItem(params);
    if (!data.Item) {
        return formatLambdaResponse(404, { message: "User not found" });
    }
    return formatLambdaResponse(200, data.Item);
}

async function updateUserProfile(userId, updates) {
    const updateExpression = 'set ' + Object.keys(updates).map(key => `${key} = :${key}`).join(', ');
    const expressionAttributeValues = Object.fromEntries(
        Object.entries(updates).map(([key, value]) => [`:${key}`, value])
    );

    const params = {
        TableName: USERS_TABLE,
        Key: { userId },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'UPDATED_NEW'
    };

    const data = await dynamoService.updateItem(params);
    return formatLambdaResponse(200, { message: "User profile updated successfully", updatedAttributes: data.Attributes });
}

async function deleteUserProfile(userId) {
    const params = {
        TableName: USERS_TABLE,
        Key: { userId }
    };

    await dynamoService.deleteItem(params);
    return formatLambdaResponse(200, { message: "User profile deleted successfully" });
}

function formatLambdaResponse(statusCode, body) {
    return {
        statusCode: statusCode,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    };
}
