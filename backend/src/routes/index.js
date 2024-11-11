
// // src/routes/index.js
// const express = require('express');
// const router = express.Router();

// // Import all route files
// const authRoutes = require('./auth.routes');
// const userRoutes = require('./user.routes');
// const familyRoutes = require('./family.routes');
// const studentRoutes = require('./student.routes');
// const epCenterRoutes = require('./ep.center.routes');
// const epProgramRoutes = require('./ep.program.routes');
// const epOfferingRoutes = require('./ep.offering.routes');
// const epRegistrationRoutes = require('./ep.registration.routes');
// const attendanceRoutes = require('./attendance.routes');

// // API Routes
// router.use('/auth', authRoutes);
// router.use('/users', userRoutes);
// router.use('/families', familyRoutes);
// router.use('/students', studentRoutes);
// router.use('/centers', epCenterRoutes);
// router.use('/programs', epProgramRoutes);
// router.use('/offerings', epOfferingRoutes);
// router.use('/registrations', epRegistrationRoutes);
// router.use('/attendance', attendanceRoutes);

// module.exports = router;


// src/routes/index.js
const express = require('express');
const router = express.Router();

// Import routes
const authRoutes = require('./auth.routes');
// Temporarily comment out other routes until they're fully implemented
const userRoutes = require('./user.routes');
// const familyRoutes = require('./family.routes');
// const studentRoutes = require('./student.routes');

// Use routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
// router.use('/families', familyRoutes);
// router.use('/students', studentRoutes);
router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'Test route is working'
    });
});

module.exports = router;