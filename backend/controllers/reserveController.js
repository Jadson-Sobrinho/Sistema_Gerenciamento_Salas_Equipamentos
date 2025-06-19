const express = require('express');
const Reserve = require('../models/Reserve');
const Resource = require('../models/Resource');

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


        const updateHours = await Resource.updateOne(
            {_id: resource_id},
            {
                $push: {
                    unavailable_hours: {
                        start: new Date(start_at),
                        end: new Date(end_at)
                    }
                }
            }
        );
        

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

        const reserves = await Reserve.find({ user_id: user_id }).populate('resource_id', 'name');

        console.log(reserves);
        res.json(reserves);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro ao buscar reservas.' });
    }
};

exports.getReservesToApprove = async (req, res) => {
    try {
        const reserves = await Reserve.find({status: 'pendente'})
            .populate('resource_id', 'name')
            .populate('user_id', 'name');

        console.log(reserves);
        res.send(reserves);
    } catch (err) {
        console.log(err);
        res.status(500).json({ erro: 'Erro ao buscar reservas.' });
    }
};

exports.updateReserveStatus = async (req, res) => {
    try {
        const { id }  = req.params;
        const { status, approval } = req.body;

        const updatedReserve = await Reserve.findByIdAndUpdate(
            id,
            {
                $set: {
                    status: status, 
                    approval: approval,
                    updated_at: new Date()
                }
            },
            { new: true }
        );

        res.json(updatedReserve);

    } catch (error) {
        console.error('Erro ao atualizar status da reserva:', error);
        res.status(500).json({ error: 'Erro ao atualizar status da reserva.'});
    }
};
