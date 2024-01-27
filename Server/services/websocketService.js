const AWS = require('aws-sdk');
const apiGateway = new AWS.ApiGatewayManagementApi({ endpoint: 'your-websocket-endpoint' });
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const WEBSOCKET_CONNECTIONS_TABLE = 'WebSocketConnections'; 

const sendMessage = async (connectionId, message) => {
    const params = {
        ConnectionId: connectionId,
        Data: JSON.stringify(message)
    };
    return apiGateway.postToConnection(params).promise();
};

const addConnection = async (connectionId) => {
    const params = {
        TableName: WEBSOCKET_CONNECTIONS_TABLE,
        Item: {
            connectionId,
            timestamp: new Date().toISOString(),
        },
    };
    return dynamoDb.put(params).promise();
};

const removeConnection = async (connectionId) => {
    const params = {
        TableName: WEBSOCKET_CONNECTIONS_TABLE,
        Key: { connectionId },
    };
    return dynamoDb.delete(params).promise();
};

module.exports = { sendMessage, addConnection, removeConnection };
