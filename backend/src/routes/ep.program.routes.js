// src/routes/ep.program.routes.js
const express = require('express');
const router = express.Router();
const EnrichmentProgramController = require('../controllers/enrichment.program.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { programValidator } = require('../middleware/validators/program.validator');

router.get('/', authenticate, authorize('ep.view'), EnrichmentProgramController.index);
router.get('/:id', authenticate, authorize('ep.view'), EnrichmentProgramController.show);
router.post('/', authenticate, authorize('ep.manage'), validate(programValidator), EnrichmentProgramController.store);
router.put('/:id', authenticate, authorize('ep.manage'), validate(programValidator), EnrichmentProgramController.update);

module.exports = router;