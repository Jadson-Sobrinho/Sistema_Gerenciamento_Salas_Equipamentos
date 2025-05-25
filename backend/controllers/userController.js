const express = require('express');
const router = express.Router();
const Usuario = require('../models/User');
const bcrypt = require('bcrypt');


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
exports.registerUser = async (req, res) => {
  try {
    const { name, email, role, phone, hashed_password, is_active } = req.body;

    // Validação de campos obrigatórios
    if (!name || !email || !hashed_password) {
      return res.status(400).json({ message: 'Nome, email e senha são obrigatórios.' });
    }

    // Verifica duplicidade de email
    const existing = await Usuario.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email já está em uso.' });
    }

    // Hash da senha recebida em hashed_password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(hashed_password, saltRounds);

    // Criação de novo usuário com senha já hasheada
    const newUser = new Usuario({
      name,
      email,
      role,
      phone,
      hashed_password: passwordHash,
      is_active: is_active !== undefined ? is_active : true
    });

    // Salvando no banco
    const savedUser = await newUser.save();

    // Retorna dados do usuário sem expor a senha
    const { _id, name: savedName, email: savedEmail, role: savedRole, phone: savedPhone, is_active: savedActive } = savedUser;
    return res.status(201).json({
      id: _id,
      name: savedName,
      email: savedEmail,
      role: savedRole,
      phone: savedPhone,
      is_active: savedActive
    });

  } catch (error) {
    // Tratamento de email duplicado
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email já está em uso.' });
    }
    console.error('Erro ao cadastrar usuário:', error);
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

exports.updateUser = async (req, res) => {
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

    const usuario = await Usuario.updateOne(
      { email: email }, // critério de busca
      {
        name,
        role,
        phone,
        hashed_password,
        is_active
      },
      { new: true }
    );

    if (usuario.modifiedCount === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado ou dados idênticos.' });
    }

    res.status(200).json({ message: 'Usuário atualizado com sucesso.' });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Erro ao atualizar usuário.' });
  }
};