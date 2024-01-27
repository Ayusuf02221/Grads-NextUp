const authService = require('./services/authService');
const { log } = require('./utils/logger');

function isPasswordComplex(password) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password);
}

exports.handler = async (event) => {
    console.log('Handler started', { event });
    try {
        let body;
        if (event.body) {
            console.log('Parsing event body');
            body = JSON.parse(event.body);
        }
        console.log('Handling event for resource: ', event.resource);
        switch (event.resource) {
            case '/register':
                if (!body || !isPasswordComplex(body.password)) {
                    return formatLambdaResponse(400, { error: 'Password does not meet complexity requirements.' });
                }

            case '/login':
                if (!body || !body.email || !body.password) {
                     return formatLambdaResponse(400, { error: 'Email and password are required.' });
                }
                console.log('User email:', body.email); // Add this line for debugging
                const loginResult = await authService.loginUser(body.email, body.password);
                await authService.updateLastLogin(body.email); 
                return formatLambdaResponse(200, loginResult);
            case '/forgotPassword':
                if (!body || !body.email) {
                    return formatLambdaResponse(400, { error: 'Email is required.' });
                }
                await authService.initiateForgotPassword(body.email);
                return formatLambdaResponse(200, { message: "Password reset email sent. Please check your email." });
    
            case '/confirmNewPassword':
                if (!body || !body.email || !body.verificationCode || !isPasswordComplex(body.newPassword)) {
                    return formatLambdaResponse(400, { error: 'Invalid request parameters.' });
                }
                await authService.confirmNewPassword(body.email, body.verificationCode, body.newPassword);
                return formatLambdaResponse(200, { message: "Password reset successfully." });
    
            case '/verifyEmail':
                if (!body || !body.email || !body.verificationCode) {
                    return formatLambdaResponse(400, { error: 'Invalid request parameters.' });
                }
                await authService.verifyEmail(body.email, body.verificationCode);
                return formatLambdaResponse(200, { message: "Email verified successfully." });
        }
    } catch (error) {
        console.error('Error caught in handler', { error });
        return handleLambdaError(error);
    }
};
    
    function formatLambdaResponse(statusCode, body) {
        return {
            statusCode: statusCode,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        };
    }
    
    function handleLambdaError(error) {
        log('error', error);
        let statusCode = error.statusCode || 500;
        let message = error.message || 'Internal server error';
        return formatLambdaResponse(statusCode, { error: message });
    }