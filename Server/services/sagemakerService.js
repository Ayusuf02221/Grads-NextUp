// sagemakerService.js
const AWS = require('aws-sdk');
const sagemaker = new AWS.SageMakerRuntime({ region: 'your-region' });

const invokeEndpoint = async (endpointName, payload) => {
    const params = {
        EndpointName: endpointName,
        Body: payload,
        ContentType: 'application/json'
    };
    return sagemaker.invokeEndpoint(params).promise();
};

module.exports = { invokeEndpoint };
