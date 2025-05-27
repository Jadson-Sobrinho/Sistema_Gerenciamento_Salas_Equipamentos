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

exports.getUserReserves = async (req, res) => {
    try {
        const user_id = req.user.sub; 
        console.log(`Rota /reserve chamada pelo usuário ${user_id}`);

        const reserves = await Reserve.find({ user_id: user_id });

        console.log(reserves);
        res.json(reserves);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro ao buscar reservas.' });
    }
};
