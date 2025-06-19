const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const auth = require('../controllers/authController');

// [GET] /room- Busca todas as salas
router.get('/', resourceController.getAllRooms);

// [GET] /room/:number - Busca uma sala pelo numero
router.get('/:room_number', resourceController.getRoomByNumber);

// POST /room - cria nova sala
router.post('/', auth.authToken, auth.requireRole('Admin'), resourceController.registerRoom);

// Patch /room - Atualizar os dados da sala
router.patch('/', resourceController.updateRoom);
  
module.exports = router;