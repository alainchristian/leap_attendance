// src/routes/ep.registration.routes.js
const express = require('express');
const router = express.Router();
const EpRegistrationController = require('../controllers/ep.registration.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { registrationValidator } = require('../middleware/validators/registration.validator');

router.get('/', authenticate, authorize('ep.view'), EpRegistrationController.index);
router.get('/student/:studentId', authenticate, EpRegistrationController.studentRegistrations);
router.post('/', authenticate, authorize('ep.manage'), validate(registrationValidator), EpRegistrationController.store);
router.put('/:id', authenticate, authorize('ep.manage'), EpRegistrationController.update);

module.exports = router;