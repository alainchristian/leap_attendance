// src/middleware/validators/auth.validator.js
const { body } = require('express-validator');

exports.loginValidator = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email format'),
    
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];