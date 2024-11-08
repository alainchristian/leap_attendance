// src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');

// Explicitly specify the methods
router.post('/login', (req, res) => AuthController.login(req, res));
router.get('/me', authenticate, (req, res) => AuthController.me(req, res));
router.post('/logout', authenticate, (req, res) => AuthController.logout(req, res));

module.exports = router;