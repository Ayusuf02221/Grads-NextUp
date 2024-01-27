const jwt = require('jsonwebtoken');
const { logError } = require('../utils/logger');

const jwtSecret = process.env.JWT_SECRET;

exports.handler = async (event) => {
    try {
        const token = event.authorizationToken.split(' ')[1];
        const decodedToken = jwt.verify(token, jwtSecret);

        return buildIAMPolicy(decodedToken.sub, 'Allow', event.methodArn);
    } catch (error) {
        logError('Authorization failed', error);
        throw 'Unauthorized';
    }
};

function buildIAMPolicy(userId, effect, resource) {
    return {
        principalId: userId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [{
                Action: 'execute-api:Invoke',
                Effect: effect,
                Resource: resource,
            }],
        },
    };
}

