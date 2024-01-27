const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const getItem = async (tableName, key) => {
    const params = { TableName: tableName, Key: key };
    return dynamoDb.get(params).promise();
};

const putItem = async (tableName, item) => {
    const params = { TableName: tableName, Item: item };
    return dynamoDb.put(params).promise();
};

const updateItem = async (tableName, key, updateExpression, expressionAttributeValues) => {
    const params = {
        TableName: tableName,
        Key: key,
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'UPDATED_NEW'
    };
    return dynamoDb.update(params).promise();
};

const queryItemsWithIndex = async (tableName, indexName, keyConditionExpression, expressionAttributeValues) => {
    const params = {
        TableName: tableName,
        IndexName: indexName,
        KeyConditionExpression: keyConditionExpression,
        ExpressionAttributeValues: expressionAttributeValues
    };
    return dynamoDb.query(params).promise();
};

module.exports = { getItem, putItem, updateItem, queryItemsWithIndex };
