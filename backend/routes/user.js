const express = require('express');
const router = express.Router();
const Usuario = require('../models/User');

// [GET] /user - Lista todos os usuários
router.get('/', async (req, res) => {
  try {
    console.log("Rota /user chamada");
    const usuarios = await Usuario.find().lean();
    console.log(usuarios);
    res.send(usuarios);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar usuários.' });
  }
});

// [GET] /user/:name - Busca um usuário pelo nome
router.get('/:name', async (req, res) => {
  try {
    const usuario = await Usuario.findOne({ name: req.params.name });;
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado.' });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar usuário.' });
  }
});

module.exports = router;