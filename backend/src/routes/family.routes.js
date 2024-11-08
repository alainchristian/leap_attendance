
// src/routes/family.routes.js
const express = require('express');
const router = express.Router();
const FamilyController = require('../controllers/family.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { familyValidator } = require('../middleware/validators/family.validator');

router.get('/', authenticate, authorize('student.view'), FamilyController.index);
router.get('/:id', authenticate, authorize('student.view'), FamilyController.show);
router.post('/', authenticate, authorize('student.create'), validate(familyValidator), FamilyController.store);
router.put('/:id', authenticate, authorize('student.edit'), validate(familyValidator), FamilyController.update);
router.delete('/:id', authenticate, authorize('student.delete'), FamilyController.destroy);

module.exports = router;