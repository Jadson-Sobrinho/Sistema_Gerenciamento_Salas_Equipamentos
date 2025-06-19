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
  unavailable_hours: [
    {
      start: {
        type: Date,
        default: undefined
      }, 
      end: {
        type: Date,
        default: undefined
      }
    }
  ],
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