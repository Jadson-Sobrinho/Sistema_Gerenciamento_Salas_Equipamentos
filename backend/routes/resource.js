const express = require('express');
const router = express.Router();
const Sala = require('../models/Room');
const resourceController = require('../controllers/resourceController');

// [GET] /room- Busca todas as salas
router.get('/', resourceController.getAllRooms);

// [GET] /room/:number - Busca uma sala pelo numero
router.get('/:room_number', resourceController.getRoomByNumber);

// POST /room - cria nova sala
router.post('/', resourceController.registerRoom);

// Patch /room - Atualizar os dados da sala
router.patch('/', resourceController.updateRoom);
  
module.exports = router;