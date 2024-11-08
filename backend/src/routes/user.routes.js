// src/routes/user.routes.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { userValidator } = require('../middleware/validators/user.validator');

// List users
router.get('/', authenticate, (req, res) => UserController.index(req, res));

// Get single user
router.get('/:id', authenticate, (req, res) => UserController.show(req, res));

// Create user
router.post('/', authenticate, validate(userValidator), (req, res) => UserController.store(req, res));

// Update user
router.put('/:id', authenticate, validate(userValidator), (req, res) => UserController.update(req, res));

// Delete user
router.delete('/:id', authenticate, (req, res) => UserController.destroy(req, res));

module.exports = router;


// // src/routes/user.routes.js
// const express = require('express');
// const router = express.Router();
// const UserController = require('../controllers/user.controller');
// const { authenticate, authorize } = require('../middleware/auth.middleware');
// const { validate } = require('../middleware/validate.middleware');
// const { userValidator } = require('../middleware/validators');

// // List users
// router.get('/', 
//     authenticate, 
//     (req, res) => UserController.index(req, res)
// );

// // Get single user
// router.get('/:id', 
//     authenticate, 
//     (req, res) => UserController.show(req, res)
// );

// // Create user
// router.post('/', 
//     authenticate, 
//     validate(userValidator), 
//     (req, res) => UserController.store(req, res)
// );

// // Update user
// router.put('/:id', 
//     authenticate, 
//     validate(userValidator), 
//     (req, res) => UserController.update(req, res)
// );

// // Delete user
// router.delete('/:id', 
//     authenticate, 
//     (req, res) => UserController.destroy(req, res)
// );

// module.exports = router;

