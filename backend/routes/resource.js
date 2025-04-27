const express = require('express');
const router = express.Router();
const Sala = require('../models/Room');

router.get('/', async (req, res) => {
    try {
        console.log("Rota /sala chamada");
        const salas = await Sala.find();
        console.log(salas);
        res.send(salas);
    } catch (err) {
        res.status(500).json({ erro: 'Erro ao buscar salas.' });
    }
});

// [GET] /room/:number - Busca uma sala pelo numero
router.get('/:room_number', async (req, res) => {
    try {
      console.log("rota number chamada");
      const salas = await Sala.findOne({ room_number: req.params.room_number });
      console.log(salas);
      if (!salas) return res.status(404).json({ erro: 'Sala não encontrada.' });
      res.json(salas);
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao buscar a sala.' });
    }
  });

module.exports = router;