// interviews Lambda Function
const dynamoService = require('./services/dynamoService');
const { v4: uuidv4 } = require('uuid');
const { log } = require('./utils/logger');

const INTERVIEWS_TABLE = 'Interviews';

exports.handler = async (event) => {
    try {
        const body = event.body ? JSON.parse(event.body) : null;
        switch (event.resource) {
            case '/listUserInterviewsByType':
                return await listUserInterviewsByType(event.queryStringParameters);
            case '/addInterviewExperience':
                return await addInterviewExperience(body);
            case '/updateInterviewExperience':
                return await updateInterviewExperience(event.pathParameters.interviewId, body);
            case '/deleteInterviewExperience':
                return await deleteInterviewExperience(event.pathParameters.interviewId);
        }
    } catch (error) {
        log('error', error);
        return formatLambdaResponse(500, { error: error.message });
    }
};

async function listUserInterviewsByType(queryParams) {
    const { userId, interviewType } = queryParams;
    let response = await dynamoService.queryItemsWithIndex(
        INTERVIEWS_TABLE, 'UserIdAndTypeIndex', 
        'userId = :userId and interviewType = :type', 
        { ':userId': userId, ':type': interviewType }
    );
    return formatLambdaResponse(200, response.Items);
}

async function addInterviewExperience(body) {
    const { userId, company, role, interviewType, experience, date } = body;
    let params = {
        TableName: INTERVIEWS_TABLE,
        Item: {
            interviewId: uuidv4(),
            userId,
            company,
            role,
            interviewType,
            experience,
            date,
            createdAt: new Date().toISOString()
        }
    };

    await dynamoService.putItem(params);
    return formatLambdaResponse(201, { message: "Interview experience added successfully." });
}

async function updateInterviewExperience(interviewId, updates) {
    let updateExpression = 'set ';
    let expressionAttributeValues = {};

    for (const [key, value] of Object.entries(updates)) {
        updateExpression += `${key} = :${key}, `;
        expressionAttributeValues[`:${key}`] = value;
    }

    updateExpression = updateExpression.slice(0, -2); // Remove trailing comma and space

    let params = {
        TableName: INTERVIEWS_TABLE,
        Key: { interviewId },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW'
    };

    const data = await dynamoService.updateItem(params);
    return formatLambdaResponse(200, { message: "Interview experience updated successfully.", updatedAttributes: data.Attributes });
}

async function deleteInterviewExperience(interviewId) {
    let params = {
        TableName: INTERVIEWS_TABLE,
        Key: { interviewId }
    };

    await dynamoService.deleteItem(params);
    return formatLambdaResponse(200, { message: "Interview experience deleted successfully." });
}

function formatLambdaResponse(statusCode, body) {
    return {
        statusCode: statusCode,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    };
}
