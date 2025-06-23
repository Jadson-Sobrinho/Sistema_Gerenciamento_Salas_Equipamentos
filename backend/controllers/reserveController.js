const express = require('express');
const ReserveModel = require('../models/Reserve');
const ResourceModel = require('../models/Resource');


exports.getAllReserves = async (req, res) => {
    try{
        const allReserves = await ReserveModel.find().populate('resource_id', 'name').populate('user_id', 'name');
        console.log(allReserves);

        res.json(allReserves);

    }catch(erro) {
        console.log(erro);
        return res.status(500).json({message: "Erro ao exportar dados das reservas", erro: erro.message});
    }
};

exports.createReserve = async (req, res) => {
    try{      
        const {
        user_id,
        resource_id,
        start_at,
        end_at
        } = req.body;

        const start = new Date(start_at);
        const end = new Date(end_at);
        
        const conflict = await ReserveModel.findOne({
            resource_id,
            start_at: {$lt: end},
            end_at: {$gt: start}
        });

        if(conflict) {
            return res.status(409).json({message: "Horário indiponível"});
        }
        
        const newReserve = new ReserveModel({
            user_id,
            resource_id,
            start_at,
            end_at
        });

        const savedReserve = await newReserve.save(); 

        const updateHours = await ResourceModel.updateOne(
            {_id: resource_id},
            {
                $push: {
                    unavailable_hours: { start, end }
                }
            }
        );
        
        return res.status(201).json({ message: 'Reservar criada com sucesso.' });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Erro ao criar reserva.', error: error.message });
    }

};

exports.getUserReserves = async (req, res) => {
    try {
        const user_id = req.user.sub; 
        console.log(`Rota /reserve chamada pelo usuário ${user_id}`);

        const reserves = await ReserveModel.find({ user_id: user_id }).populate('resource_id', 'name');

        console.log(reserves);
        res.json(reserves);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro ao buscar reservas.' });
    }
};

exports.getReservesToApprove = async (req, res) => {
    try {
        const reserves = await ReserveModel.find({status: 'pendente'})
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

        const updatedReserve = await ReserveModel.findByIdAndUpdate(
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


exports.cancelReserve = async (req, res) => {
  const { reserva_id } = req.params;
  const { resource_id, start_at, end_at } = req.body;

  const startDate = new Date(start_at);
  const endDate = new Date(end_at);

  console.log(resource_id, start_at, end_at);

  try {
    await ReserveModel.updateOne(
        { _id: reserva_id },
        { $set: {status: 'cancelada'} }
    );
    await ResourceModel.updateOne(
        { _id: resource_id },
        { $pull: { unavailable_hours: { start: startDate, end: endDate }}}
    );

    return res.status(200).json({ message: 'Reserva cancelada e horário liberado com sucesso.' });

  } catch (error) {
    res.status(500).json({ message: 'Erro ao cancelar reserva.' });
  }

};
  