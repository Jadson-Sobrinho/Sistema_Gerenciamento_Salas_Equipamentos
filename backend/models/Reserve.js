const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario', // Referência ao model de usuário
    required: true
  },
  resource_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sala', // Ou o model que representa o recurso (ex: Sala, Equipamento etc.)
    required: true
  },
  start_at: {
    type: Date,
    required: true
  },
  end_at: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pendente', 'aprovada', 'rejeitada', 'concluída', 'cancelada'],
    default: 'pendente'
  },
  approval: {
    type: Boolean,
    default: false
  },
  alert: {
    type: Boolean,
    default: false
  },
  cancelled: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Atualiza o campo `updated_at` automaticamente antes de salvar
reservaSchema.pre('save', function (next) {
  this.updated_at = new Date();
  next();
});

const Reserva = mongoose.model('Reserve', reservaSchema, 'Reserve');

module.exports = Reserva;