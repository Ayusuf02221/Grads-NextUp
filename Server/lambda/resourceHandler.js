// resources Lambda Function
const dynamoService = require('./services/dynamoService');
const { v4: uuidv4 } = require('uuid');
const { log } = require('./utils/logger');

exports.handler = async (event) => {
    try {
        const body = event.body ? JSON.parse(event.body) : null;
        switch (event.resource) {
            case '/listResources':
                return await listResources(event.queryStringParameters);
            case '/addResource':
                return await addResource(body);
            case '/updateResource':
                return await updateResource(event.pathParameters.resourceId, body);
            case '/deleteResource':
                return await deleteResource(event.pathParameters.resourceId);
        }
    } catch (error) {
        log('error', error);
        return formatLambdaResponse(500, { error: error.message });
    }
};

async function listResources(queryParams) {
    const { topic, difficulty, page, limit } = queryParams;
    let response = await dynamoService.queryItemsWithIndex(
        'Resources', 'topic-difficulty-index',
        'topic = :t and difficulty = :d',
        { ':t': topic, ':d': difficulty }
    );
    return formatLambdaResponse(200, {
        items: response.Items,
        lastEvaluatedKey: response.LastEvaluatedKey,
    });
}


async function addResource(body) {
    const { title, url, description, topic, difficulty } = body;
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

    await dynamoService.putItem(params);
    return formatLambdaResponse(201, { message: "Resource added successfully", resource: params.Item });
}

async function updateResource(resourceId, updates) {
    const updateExpression = 'set ' + Object.keys(updates).map(key => `${key} = :${key}`).join(', ');
    const expressionAttributeValues = Object.fromEntries(
        Object.entries(updates).map(([key, value]) => [`:${key}`, value])
    );

    const params = {
        TableName: 'Resources',
        Key: { resourceId },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'UPDATED_NEW'
    };

    const data = await dynamoService.updateItem(params);
    return formatLambdaResponse(200, { message: "Resource updated successfully", updatedAttributes: data.Attributes });
}

async function deleteResource(resourceId) {
    const params = {
        TableName: 'Resources',
        Key: { resourceId },
    };

    await dynamoService.deleteItem(params);
    return formatLambdaResponse(200, { message: "Resource deleted successfully" });
}

function formatLambdaResponse(statusCode, body) {
    return {
        statusCode: statusCode,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    };
}