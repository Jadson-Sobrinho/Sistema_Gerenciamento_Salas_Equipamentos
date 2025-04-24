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
    required: true
  },
  hashed_password: {
    type: String,
    required: true
  },
  is_Active: {
    type: Boolean,
    required: true
  }
});

// Criando o model a partir do schema
const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;