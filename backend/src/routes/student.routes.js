// src/routes/student.routes.js
const express = require('express');
const router = express.Router();
const StudentController = require('../controllers/student.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { studentValidator } = require('../middleware/validators/student.validator');

router.get('/', authenticate, authorize('student.view'), StudentController.index);
router.get('/:id', authenticate, authorize('student.view'), StudentController.show);
router.post('/', authenticate, authorize('student.create'), validate(studentValidator), StudentController.store);
router.put('/:id', authenticate, authorize('student.edit'), validate(studentValidator), StudentController.update);
router.delete('/:id', authenticate, authorize('student.delete'), StudentController.destroy);

module.exports = router;