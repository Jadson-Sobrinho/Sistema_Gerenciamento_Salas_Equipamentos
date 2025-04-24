const { required } = require('joi');
const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: True
  },
  hashed_password: {
    type: String,
    required: True
  },
  is_Active: {
    type: Boolean,
    required: True
  }
});

// Criando o model a partir do schema
const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;