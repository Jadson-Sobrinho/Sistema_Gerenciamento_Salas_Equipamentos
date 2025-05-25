const express = require('express');
const Reserve = require('../models/Reserve');

  exports.Reserve = async (req, res) => {
    try{      
        const {
        user_id,
        resource_id,
        start_at,
        end_at
        } = req.body;
        
        const newReserve = new Reserve({
        user_id,
        resource_id,
        start_at,
        end_at
        });

        const savedReserve = await newReserve.save();

        res.status(200).json({ message: 'Reservar criada com sucesso.' });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Erro ao criar reserva.', error: error.message });
    }

};

exports.getAllReserves = async (req, res) => {
    try {
        console.log("Rota /Reserve chamada");
        const reserves = await Reserve.find();
        console.log(reserves);
        res.send(reserves);
    } catch (err) {
        res.status(500).json({ erro: 'Erro ao buscar Reservas.' });
    }
};
