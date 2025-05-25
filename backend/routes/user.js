const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");

// [GET] /user - Lista todos os usuários
router.get('/', userController.getAllUsers);

// [GET] /user/:name - Busca um usuário pelo nome
router.get('/:name', userController.getByName);

// [POST] /user - cria novo usuário
router.post('/', userController.registerUser);

// [PATCH] /user - Atualiza dados de um usuario
router.patch('/', userController.updateUser);
  

module.exports = router;