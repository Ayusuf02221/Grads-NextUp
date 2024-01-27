// db.js

// Import the AWS SDK and retrieve the configured instance
const AWS = require('./aws');

// Create and configure an instance of the DynamoDB Document Client
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = dynamoDb;
