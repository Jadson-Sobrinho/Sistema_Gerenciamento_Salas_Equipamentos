const express = require('express');
const router = express.Router();
const Sala = require('../models/Room');

exports.getAllRooms = async (req, res) => {
    try {
        console.log("Rota /sala chamada");
        const salas = await Sala.find();
        console.log(salas);
        res.send(salas);
    } catch (err) {
        res.status(500).json({ erro: 'Erro ao buscar salas.' });
    }
};

// [GET] /room/:number - Busca uma sala pelo numero
exports.getRoomByNumber = async (req, res) => {
    try {
      console.log("rota number chamada");
      const salas = await Sala.findOne({ room_number: req.params.room_number });
      console.log(salas);
      if (!salas) return res.status(404).json({ erro: 'Sala não encontrada.' });
      res.json(salas);
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao buscar a sala.' });
    }
  };


// POST /room - cria nova sala
exports.registerRoom = async (req, res) => {
    try {
        console.log("Rota /room [POST]");
      const {
        name,
        room_number,
        type,
        capacity,
        tags,
        module,
        floor,
        status,
        available_hours,
        description
      } = req.body;
      
      console.log(req.body);

      const newRoom = new Sala({
        name,
        room_number,
        type,
        capacity,
        tags,
        module,
        floor,
        status,
        available_hours,
        description
      });
      

      const savedRoom = await newRoom.save();
      res.status(201).json(savedRoom);
  
    } catch (error) {
      if (error.code === 11000) {
        res.status(400).json({ message: 'Número da sala já está em uso.' });
      } else {
        res.status(500).json({ message: 'Erro ao criar sala.', error });
      }
    }
  };


  exports.updateRoom = async (req, res) => {
    try {
      const {
        name,
        room_number,
        type,
        capacity,
        tags,
        module,
        floor,
        status,
        available_hours,
        description
      } = req.body;
      
      console.log(req.body);

      const room = await Sala.updateOne(
        {room_number: room_number}, 
        {
          name,
          room_number,
          type,
          capacity,
          tags,
          module,
          floor,
          status,
          available_hours,
          description
        }, { new: true }
      );
      
      if (room.modifiedCount === 0) {
        return res.status(404).json({ message: 'Sala não encontrada ou dados idênticos.' });
      }

      res.status(200).json({ message: 'Sala atualizada com sucesso.' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Erro ao atualizar sala.', error });
      
    }
  };


  