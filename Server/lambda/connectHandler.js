const websocketService = require('./services/websocketService');
const { log } = require('./utils/logger');

exports.handler = async (event) => {
    try {
        if (!event.requestContext || !event.requestContext.connectionId) {
            throw new Error("requestContext or connectionId is undefined");
        }

        const connectionId = event.requestContext.connectionId;
        await websocketService.addConnection(connectionId);
        log('info', `Connection established: ${connectionId}`);
        return { statusCode: 200, body: 'Connected.' };
    } catch (error) {
        // Use log function with 'error' level
        log('error', 'Connection establishment failed', { error: error.message });
        return { statusCode: 500, body: 'Failed to connect.' };
    }
};
