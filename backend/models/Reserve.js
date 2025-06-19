const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resource_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource',
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
  alert: {
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

const Reserve = mongoose.model('Reserve', reservaSchema, 'Reserve');

module.exports = Reserve;