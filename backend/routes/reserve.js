const express = require('express');
const router  = express.Router();
const auth    = require('../controllers/authController');
const reserve = require('../controllers/reserveController');

// POST /reserve — cria reserva usando o ID que vem do token
router.post('/', auth.authToken, reserve.Reserve);

router.get('/', auth.authToken, reserve.getUserReserves);

module.exports = router;