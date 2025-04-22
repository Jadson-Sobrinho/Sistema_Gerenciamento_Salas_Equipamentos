const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
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
    enum: ['projetor', 'caixa de som', 'cromebook'],
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
  available_hours: {
    type: [String], // ex: ["08:00-12:00", "14:00-18:00"]
    default: []
  },
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
equipmentSchema.pre('save', function (next) {
  this.updated_at = new Date();
  next();
});

const Equipamento = mongoose.model('Equipamento', equipmentSchema);

module.exports = Equipamento;