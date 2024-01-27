const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider();
const { COGNITO_USER_POOL_ID, COGNITO_CLIENT_ID } = process.env;

const loginUser = async (username, password) => {
    console.log('Attempting to log in user', { username });
    const params = {
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: COGNITO_CLIENT_ID,
        AuthParameters: { USERNAME: username, PASSWORD: password }
    };
    try {
        const authResult = await cognito.initiateAuth(params).promise();
        console.log('User logged in successfully', { username });
        return authResult;
    } catch (error) {
        console.error('Error logging in user', { username, error });
        throw error;
    }
};

const updateLastLogin = async (username) => {
    console.log('Updating last login for user', { username });
    const params = {
        UserPoolId: COGNITO_USER_POOL_ID,
        Username: username,
        UserAttributes: [
            { Name: 'custom:lastLogin', Value: new Date().toISOString() },
        ]
    };
    try {
        await cognito.adminUpdateUserAttributes(params).promise();
        console.log('Last login updated successfully', { username });
    } catch (error) {
        console.error('Error updating last login', { username, error });
        throw error;
    }
};

const initiateForgotPassword = async (email) => {
    console.log('Initiating forgot password process', { email });
    const params = {
        ClientId: COGNITO_CLIENT_ID,
        Username: email
    };
    try {
        const result = await cognito.forgotPassword(params).promise();
        console.log('Forgot password initiated', { email });
        return result;
    } catch (error) {
        console.error('Error initiating forgot password', { email, error });
        throw error;
    }
};

const confirmNewPassword = async (email, verificationCode, newPassword) => {
    console.log('Confirming new password', { email, verificationCode });
    const params = {
        ClientId: COGNITO_CLIENT_ID,
        Username: email,
        ConfirmationCode: verificationCode,
        Password: newPassword
    };
    try {
        const result = await cognito.confirmForgotPassword(params).promise();
        console.log('New password confirmed', { email });
        return result;
    } catch (error) {
        console.error('Error confirming new password', { email, error });
        throw error;
    }
};

const verifyEmail = async (email, verificationCode) => {
    console.log('Verifying email', { email, verificationCode });
    const params = {
        UserPoolId: COGNITO_USER_POOL_ID,
        Username: email,
        ConfirmationCode: verificationCode
    };
    try {
        const result = await cognito.confirmSignUp(params).promise();
        console.log('Email verified', { email });
        return result;
    } catch (error) {
        console.error('Error verifying email', { email, error });
        throw error;
    }
};

module.exports = {
    loginUser,
    updateLastLogin,
    initiateForgotPassword,
    confirmNewPassword,
    verifyEmail
};
