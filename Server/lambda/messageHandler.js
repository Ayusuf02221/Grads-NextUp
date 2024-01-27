const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require('uuid'); // For generating unique message IDs
const { sendMessage } = require('./services/websocketService'); 
const log = console.log; 

const MESSAGES_TABLE = 'Messages'; 
exports.handler = async (event) => {
    // Log the entire event object to understand its structure
    console.log("Received event:", JSON.stringify(event, null, 2));

    // Extract the connection ID from the event object
    const connectionId = event.requestContext?.connectionId;

    // Check if connectionId is undefined
    if (!connectionId) {
        console.error("Connection ID is missing in the event");
        return { statusCode: 400, body: 'Connection ID missing' };
    }

    // Parse the message body from the event
    let message;
    try {
        message = JSON.parse(event.body);
    } catch (error) {
        // Log parsing error
        console.error("Error parsing message body:", error);
        return { statusCode: 400, body: 'Invalid message format' };
    }

    try {
        // Store the received message in DynamoDB
        await storeMessage(connectionId, message);

        // Send confirmation back to the sender
        await sendMessage(connectionId, { message: 'Message received and stored.' });

        log(`Message processed for connectionId: ${connectionId}`);
        return { statusCode: 200, body: 'Message processed.' };
    } catch (error) {
        // Log and return the error
        console.error(`Error processing message: ${error.message}`);
        return { statusCode: 500, body: 'Failed to process message.' };
    }
};

async function storeMessage(connectionId, messageContent) {
    const params = {
        TableName: MESSAGES_TABLE,
        Item: {
            messageId: uuidv4(), // Generate a unique ID for the message
            connectionId,
            content: messageContent, // Assuming 'content' is the structure of your message
            timestamp: new Date().toISOString(),
        },
    };
    await dynamoDb.put(params).promise();
    log(`Stored message from ${connectionId}`);
}
