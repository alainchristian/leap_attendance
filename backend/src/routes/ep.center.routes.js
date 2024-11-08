// src/routes/ep.center.routes.js
const express = require('express');
const router = express.Router();
const EpCenterController = require('../controllers/ep.center.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { centerValidator } = require('../middleware/validators/center.validator');

router.get('/', authenticate, authorize('ep.view'), EpCenterController.index);
router.post('/', authenticate, authorize('ep.manage'), validate(centerValidator), EpCenterController.store);
router.put('/:id', authenticate, authorize('ep.manage'), validate(centerValidator), EpCenterController.update);

module.exports = router;