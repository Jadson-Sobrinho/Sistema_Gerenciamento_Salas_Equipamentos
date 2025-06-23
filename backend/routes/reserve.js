const express = require('express');
const router  = express.Router();
const auth    = require('../controllers/authController');
const reserve = require('../controllers/reserveController');

// POST /reserve — cria reserva usando o ID que vem do token
router.post('/', auth.authToken, reserve.createReserve);

router.get('/', auth.authToken, reserve.getUserReserves);

router.get('/approve', reserve.getReservesToApprove);

router.patch('/:id/status', auth.authToken, auth.requireRole('Admin'), reserve.updateReserveStatus);

router.patch('/:reserva_id/cancel', auth.authToken, reserve.cancelReserve);

//router.get('/allReserves', reserve.getAllReserves);

module.exports = router;