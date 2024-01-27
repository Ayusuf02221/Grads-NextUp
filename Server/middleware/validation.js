const { body, validationResult } = require('express-validator');

// Validation rules for updating a user profile
const validateUserUpdate = [
    // Add validation rules based on your user model. For example:
    body('email').isEmail().withMessage('Invalid email address'),
    body('name').not().isEmpty().withMessage('Name is required'),
    // Add more fields as necessary
];

// General function to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = { validateUserUpdate, handleValidationErrors };
