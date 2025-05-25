const express = require('express');
const router = express.Router();
const reserveController = require('../controllers/reserveController');


router.post('/', reserveController.Reserve);

router.get('/', reserveController.getAllReserves);

module.exports = router;