const AWS = require('../config/aws');
const cognito = new AWS.CognitoIdentityServiceProvider();
const { validationResult } = require('express-validator');
const { log } = require('../utils/logger');
const { handleError, handleCognitoError } = require('../utils/errorHandler');

const UserPoolId = process.env.COGNITO_USER_POOL_ID;
const ClientId = process.env.COGNITO_CLIENT_ID;

// Function to check password complexity (Modify as per your password policy)
function isPasswordComplex(password) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password); // Minimum eight characters, at least one uppercase letter, one lowercase letter and one number
}

// Register a new user
exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { email, password, name, preferences } = req.body;
    
    // Check password complexity
    if (!isPasswordComplex(password)) {
        return res.status(400).json({ error: "Password does not meet complexity requirements." });
    }

    var params = {
        ClientId,
        Username: email,
        Password: password,
        UserAttributes: [
            { Name: 'email', Value: email },
            { Name: 'name', Value: name },
            { Name: 'custom:preferences', Value: JSON.stringify(preferences) || "{}" },
        ]
    };

    try {
        const data = await cognito.signUp(params).promise();
        res.status(201).send({ message: "User registered successfully. Please check your email to confirm registration.", userSub: data.UserSub });
        log('info', 'User registered successfully.');
    } catch (error) {
        handleCognitoError(res, error); // Use the Cognito-specific error handler
    }
};

// User login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    var params = {
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId,
        AuthParameters: { 'USERNAME': email, 'PASSWORD': password }
    };

    try {
        const data = await cognito.initiateAuth(params).promise();
        // Update last login upon successful authentication
        await exports.updateLastLogin(email);
        res.status(200).json({ message: "Login successful", authenticationDetails: data.AuthenticationResult });
        log('info', `User logged in: ${email}`);
    } catch (error) {
        handleCognitoError(res, error); // Use the Cognito-specific error handler
    }
};

// Password reset request
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    var params = {
        ClientId,
        Username: email
    };

    try {
        await cognito.forgotPassword(params).promise();
        res.status(200).json({ message: "Password reset email sent. Please check your email." });
        log('info', `Password reset initiated for: ${email}`);
    } catch (error) {
        handleCognitoError(res, error); // Use the Cognito-specific error handler
    }
};

// Confirm new password
exports.confirmNewPassword = async (req, res) => {
    const { email, verificationCode, newPassword } = req.body;
    var params = {
        ClientId,
        Username: email,
        ConfirmationCode: verificationCode,
        Password: newPassword
    };

    try {
        await cognito.confirmForgotPassword(params).promise();
        res.status(200).json({ message: "Password reset successfully." });
        log('info', `Password reset confirmed for: ${email}`);
    } catch (error) {
        handleCognitoError(res, error); // Use the Cognito-specific error handler
    }
};

// Email verification - Assume this is triggered after registration
exports.verifyEmail = async (req, res) => {
    const { email, verificationCode } = req.body;
    var params = {
        UserPoolId,
        Username: email,
        ConfirmationCode: verificationCode
    };

    try {
        await cognito.confirmSignUp(params).promise();
        res.status(200).json({ message: "Email verified successfully." });
        log('info', `Email verified for: ${email}`);
    } catch (error) {
        handleCognitoError(res, error); // Use the Cognito-specific error handler
    }
};

// Update last login after a successful login
exports.updateLastLogin = async (userId) => {
    var params = {
        UserPoolId,
        Username: userId,
        UserAttributes: [
            { Name: 'custom:lastLogin', Value: new Date().toISOString() },
        ]
    };
    try {
        await cognito.adminUpdateUserAttributes(params).promise();
        log('info', `Last login time updated for user: ${userId}`);
    } catch (error) {
        log('error', `Error updating last login for user: ${userId} - ${error}`);
    }
};

// Add other authentication related methods as needed...
