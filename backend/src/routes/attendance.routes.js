// src/routes/attendance.routes.js
const express = require('express');
const router = express.Router();
const AttendanceController = require('../controllers/attendance.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { attendanceValidator } = require('../middleware/validators/attendance.validator');

router.get('/', authenticate, authorize('attendance.view'), AttendanceController.index);
router.get('/student', authenticate, AttendanceController.getStudentAttendance);
router.post('/', authenticate, authorize('attendance.mark'), validate(attendanceValidator), AttendanceController.store);
router.post('/bulk', authenticate, authorize('attendance.mark'), AttendanceController.bulkStore);
router.put('/:id', authenticate, authorize('attendance.mark'), validate(attendanceValidator), AttendanceController.update);

module.exports = router;
