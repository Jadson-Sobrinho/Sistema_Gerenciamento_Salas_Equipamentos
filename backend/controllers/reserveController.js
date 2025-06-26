const express = require('express');
const ReserveModel = require('../models/Reserve');
const ResourceModel = require('../models/Resource');
const mongoose = require('mongoose');


exports.getReservesByDate = async (req, res) => {
  try {
    const { resource_id } = req.params;
    const { data }       = req.query;  // ex: ?data=2025-06-25

    if (!data) {
      return res.json([]);
    }

    const startOfDay = new Date(`${data}T00:00:00.000Z`);
    const endOfDay   = new Date(`${data}T23:59:59.999Z`);

    // 1) Busca o recurso pelo _id correto
    const recurso = await ResourceModel.findById(resource_id).exec();
    if (!recurso) {
      return res.status(404).json({ message: 'Recurso não encontrado.' });
    }

    // 2) Filtra apenas os blocos que se sobrepõem ao dia
    const horarios = recurso.unavailable_hours
      .filter(({ start, end }) =>
        start < endOfDay && end > startOfDay
      )
      // 3) Ordena pela hora de início
      .sort((a, b) => a.start - b.start)
      // 4) Retorna só start/end em ISO (ou formate do jeito que o front precisar)
      .map(({ start, end }) => ({
        start: start,
        end:   end
      }));

    return res.json(horarios);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Erro ao buscar horários indisponíveis.',
      error: error.message
    });
  }
};

exports.getReservasDoMes = async (req, res) => {
    try {
        const { resource_id } = req.params;
        const { ano, mes } = req.query;

        if (!ano || !mes) {
            return res.status(400).json({ message: "Ano e mês são obrigatórios." });
        }

        const year = parseInt(ano);
        const month = parseInt(mes) - 1; // JS Date usa mês 0-11

        const startOfMonth = new Date(Date.UTC(year, month, 1));
        const endOfMonth = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));

        const pipeline = [
            // 1. Encontra o recurso específico pelo seu ID
            {
                $match: { _id: new mongoose.Types.ObjectId(resource_id) }
            },
            // 2. "Desmonta" o array, criando um documento separado para cada horário
            {
                $unwind: '$unavailable_hours'
            },
            // 3. Filtra esses horários individuais para manter apenas os do mês desejado
            {
                $match: {
                    'unavailable_hours.start': {
                        $gte: startOfMonth,
                        $lte: endOfMonth
                    }
                }
            },
            // 4. Substitui o documento inteiro pelo subdocumento do horário, limpando a saída
            {
                $replaceRoot: { newRoot: '$unavailable_hours' }
            }
        ];

        // Executa a agregação no ResourceModel
        const reservasDoMes = await ResourceModel.aggregate(pipeline);
        
        // Agora, 'reservasDoMes' é um array no formato que o frontend espera:
        // [{ start: ISODate(...), end: ISODate(...), reservationId: ... }]
        res.json(reservasDoMes);

        console.log(resource_id);
        console.log(ano, mes, startOfMonth, endOfMonth);
        console.log(reservasDoMes);

    } catch (erro) {
        console.error("Erro ao buscar reservas do mês:", erro);
        return res.status(500).json({ message: "Erro ao buscar dados das reservas do mês", erro: erro.message });
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

        console.log(user_id);

        const start = new Date(start_at);
        const end = new Date(end_at);
        
        const conflict = await ResourceModel.findOne({
            _id: resource_id,
            unavailable_hours: {
                $elemMatch: {
                    start: { $lt: end },
                    end: { $gt: start }
                }
            }
        });

        if (conflict) {
            return res.status(409).json({ message: "Horário indisponível." });
        }
        
        const newReserve = new ReserveModel({
            user_id,
            resource_id,
            start_at,
            end_at
        });

        const savedReserve = await newReserve.save(); 

        const updateHours = await ResourceModel.updateOne(
            { _id: resource_id },
            {
                $push: {
                    unavailable_hours: {
                        start,
                        end,
                        reservationId: savedReserve._id // <-- VÍNCULO ADICIONADO
                    }
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
        const { resource_id, start_at, end_at, status } = req.body;

        const startDate = new Date(start_at);
        const endDate = new Date(end_at);

        await ReserveModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    status: status,
                    updated_at: new Date()
                }
            },
            { new: true }
        );

        if (status === 'rejeitada' || status === 'cancelada') { // Adicionado 'cancelada' para consistência
            await ResourceModel.updateOne(
                { _id: resource_id },
                // Explicação: Remove o elemento do array cujo 'reservationId' bate com o ID da reserva atualizada.
                { $pull: { unavailable_hours: { reservationId: id } } }
            );
        }

        return res.status(200).json({ message: 'Operação concluída sucesso.' });

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
        { $pull: { unavailable_hours: { reservationId: reserva_id } } }
    );

    return res.status(200).json({ message: 'Reserva cancelada e horário liberado com sucesso.' });

  } catch (error) {
    res.status(500).json({ message: 'Erro ao cancelar reserva.' });
  }

};
  