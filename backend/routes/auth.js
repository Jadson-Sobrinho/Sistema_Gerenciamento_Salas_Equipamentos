const express = require('express');
const router  = express.Router();
const auth    = require('../controllers/authController');

// POST /auth/login
router.post('/login', auth.loginUser);

// GET /auth/me — retorna perfil do usuário autenticado
router.get('/me', auth.authToken, auth.getProfile);

module.exports = router;
