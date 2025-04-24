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


module.exports = router;