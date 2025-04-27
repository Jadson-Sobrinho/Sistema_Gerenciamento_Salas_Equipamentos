const express = require('express');
const router = express.Router();
const Usuario = require('../models/User');
const userController = require("../controllers/userController");

// [GET] /user - Lista todos os usuários
router.get('/', userController.getAllUsers);

// [GET] /user/:name - Busca um usuário pelo nome
router.get('/:name', userController.getByName);

// [POST] /user - cria novo usuário
router.post('/', userController.resgisterUser);
  

module.exports = router;