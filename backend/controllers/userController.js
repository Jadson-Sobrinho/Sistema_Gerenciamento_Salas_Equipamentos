const express = require('express');
const router = express.Router();
const Usuario = require('../models/User');


exports.getAllUsers = async (req, res) => {
  try {
    console.log("Rota /user chamada");
    const usuarios = await Usuario.find().lean();
    console.log(usuarios);
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar usuários.' });
  }
};

// [GET] /user/:name - Busca um usuário pelo nome
exports.getByName = async (req, res) => {
  try {
    console.log("rota name chamada");
    const usuario = await Usuario.findOne({ name: req.params.name });
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado.' });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar usuário.' });
  }
};

// [POST] /user - cria novo usuário
exports.resgisterUser = async (req, res) => {
  try {
    const {
      name,
      email,
      role,
      phone,
      hashed_password,
      is_active
    } = req.body;

    console.log(req.body);

    // Criação de novo usuário
    const newUser = new Usuario({
      name,
      email,
      role,
      phone,
      hashed_password,
      is_active
    });

    // Salvando no banco
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);

  } catch (error) {
    // Tratamento de erro, como email duplicado
    if (error.code === 11000) {
      res.status(400).json({ message: 'Email já está em uso.' });
    } else {
      console.log(error);
    }
  }
};