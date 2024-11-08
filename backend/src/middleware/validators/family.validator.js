// src/middleware/validators/family.validator.js
const { body } = require('express-validator');

exports.familyValidator = [
    body('family_name')
        .trim()
        .notEmpty()
        .withMessage('Family name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Family name must be between 2 and 100 characters'),
    
    body('family_mama')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Family mama name must be between 2 and 100 characters')
];