const websocketService = require('./services/websocketService');
const { log } = require('./utils/logger');

exports.handler = async (event) => {
    let connectionId;
    try {
        // Ensuring connectionId is available
        if (!event.requestContext || !event.requestContext.connectionId) {
            throw new Error("requestContext or connectionId is undefined");
        }
        connectionId = event.requestContext.connectionId;

        await websocketService.removeConnection(connectionId);
        log('info', `Connection closed: ${connectionId}`);
        return { statusCode: 200, body: 'Disconnected.' };
    } catch (error) {
        // Use log function with 'error' level
        log('error', 'Connection closure failed', { error: error.message, connectionId });
        return { statusCode: 500, body: 'Failed to disconnect.' };
    }
};
