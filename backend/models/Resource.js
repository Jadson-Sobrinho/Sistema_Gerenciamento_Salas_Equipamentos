const mongoose = require('mongoose');

const salaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  room_number: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['sala', 'laboratório', 'auditório'],
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  tags: {
    type: [String],
    default: []
  },
  module: {
    type: String,
    required: true
  },
  floor: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['disponível', 'indisponível', 'manutenção'],
    default: 'disponível'
  },
  unavailable_hours: [{
      // Para evitar que o MongoDB crie um _id para cada horário indisponível
      _id: false, 

      start: {
          type: Date,
          required: [true, 'A data de início da reserva é obrigatória.']
      },
      end: {
          type: Date,
          required: [true, 'A data de término da reserva é obrigatória.']
      },
      reservationId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Reserve',
          required: true
      }
  }],
  description: {
    type: String
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

// Middleware para atualizar `updated_at` automaticamente
salaSchema.pre('save', function (next) {
  this.updated_at = new Date();
  next();
});

const Sala = mongoose.model('Resource', salaSchema, 'Resource');

module.exports = Sala;