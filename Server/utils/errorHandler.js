// errorHandler.js
const { log } = require('./logger');

// Generic error handler to standardize error response
exports.handleError = (res, error, message = 'An error occurred') => {
  log('error', `${message}: ${error}`); // Log the error for debugging
  const statusCode = error.statusCode || 500; // Default to 500 if no specific status code is provided
  res.status(statusCode).json({
    message: message,
    error: error.toString(), // Send the error message back to the client
  });
};

// Handler for database connection errors
exports.handleDatabaseError = (res, error) => {
    log('error', `Database Error: ${error}`);
    res.status(500).json({
      message: 'Failed to connect to the database',
      error: error.toString(),
    });
  };
  
  // Handler for validation errors
  exports.handleValidationError = (res, error) => {
    log('error', `Validation Error: ${error}`);
    res.status(400).json({
      message: 'Data validation failed',
      errors: error.array(), // Assuming error is an array of validation errors
    });
  };
  
  // Handler for not found errors
  exports.handleNotFoundError = (res, resource = 'Resource') => {
    log('warn', `${resource} Not Found`);
    res.status(404).json({
      message: `${resource} not found`,
    });
  };
  
  // Handler for unauthorized access
  exports.handleUnauthorizedError = (res, error = 'Unauthorized access') => {
    log('warn', `Unauthorized Error: ${error}`);
    res.status(401).json({
      message: 'Unauthorized. You do not have permission to access this resource.',
      error: error.toString(),
    });
  };

  // Handler for DynamoDB errors
exports.handleDynamoError = (res, error) => {
  log('error', `DynamoDB Error: ${error}`);
  let message = 'Failed to process the request in DynamoDB';

  // Handling specific DynamoDB error codes
  switch (error.code) {
      case 'ConditionalCheckFailedException':
          message = 'A conditional request in DynamoDB failed';
          break;
      case 'ProvisionedThroughputExceededException':
          message = 'DynamoDB request rate is too high';
          break;
      case 'ResourceNotFoundException':
          message = 'The requested DynamoDB resource was not found';
          break;
      case 'ItemCollectionSizeLimitExceededException':
          message = 'An item collection in DynamoDB is too large';
          break;
      case 'TransactionConflictException':
          message = 'A transaction conflict occurred in DynamoDB';
          break;
      case 'RequestLimitExceeded':
          message = 'The number of allowed DynamoDB requests was exceeded';
          break;
      // Add more error codes as needed
      default:
          message = `An unexpected error occurred in DynamoDB: ${error.code}`;
          break;
  }

  res.status(500).json({
      message: message,
      error: error.toString(),
  });
};
