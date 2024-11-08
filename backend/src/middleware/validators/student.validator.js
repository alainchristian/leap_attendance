
// src/middleware/validators/student.validator.js
const { body } = require('express-validator');

exports.studentValidator = [
    body('unique_id')
        .trim()
        .notEmpty()
        .withMessage('Student ID is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Student ID must be between 2 and 50 characters'),
    
    body('first_name')
        .trim()
        .notEmpty()
        .withMessage('First name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters'),
    
    body('last_name')
        .trim()
        .notEmpty()
        .withMessage('Last name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be between 2 and 50 characters'),
    
    body('family_id')
        .notEmpty()
        .withMessage('Family ID is required')
        .isInt()
        .withMessage('Family ID must be a number'),
    
    body('gender')
        .notEmpty()
        .withMessage('Gender is required')
        .isIn(['Male', 'Female'])
        .withMessage('Gender must be either Male or Female')
];
