const jwt = require('jsonwebtoken');
const AWS = require('../config/aws');
const cognito = new AWS.CognitoIdentityServiceProvider();
const { logError } = require('../utils/logger');
const { handleError } = require('../utils/errorHandler');

// Replace with your actual User Pool ID and App Client ID from environment variables
const UserPoolId = process.env.COGNITO_USER_POOL_ID; 
const ClientId = process.env.COGNITO_CLIENT_ID; 
const jwtSecret = process.env.JWT_SECRET; 

exports.isAuthenticated = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, jwtSecret);

        const params = { AccessToken: token };
        const response = await cognito.getUser(params).promise();

        if (response && response.UserAttributes) {
            req.user = {
                id: decodedToken.sub,
                email: decodedToken.email,
            };
            next();
        } else {
            throw new Error('Invalid user');
        }
    } catch (error) {
        logError('Authentication failed', error);
        handleError(res, 'Authentication failed', 401);
    }
};
