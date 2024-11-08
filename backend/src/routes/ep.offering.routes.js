

// src/routes/ep.offering.routes.js
const express = require('express');
const router = express.Router();
const EpOfferingController = require('../controllers/ep.offering.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { offeringValidator } = require('../middleware/validators/offering.validator');

router.get('/', authenticate, authorize('ep.view'), EpOfferingController.index);
router.get('/teacher', authenticate, EpOfferingController.teacherOfferings);
router.get('/available', authenticate, EpOfferingController.availableOfferings);
router.post('/', authenticate, authorize('ep.manage'), validate(offeringValidator), EpOfferingController.store);
router.put('/:id', authenticate, authorize('ep.manage'), validate(offeringValidator), EpOfferingController.update);

module.exports = router;