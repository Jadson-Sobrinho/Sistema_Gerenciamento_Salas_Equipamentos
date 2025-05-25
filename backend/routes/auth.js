const express = require('express');
const router = express.Router();
const authController = require('../../backend/controllers/authController');

// POST /auth/login
router.post('/login', authController.loginUser);

module.exports = router;