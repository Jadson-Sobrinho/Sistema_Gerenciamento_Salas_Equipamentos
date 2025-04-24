const mongoose = require("mongoose");


async function connectDB() {
    try{
        await mongoose.connect('mongodb://localhost:27017/reserve');

        console.log("Conectado ao banco!");
    } catch (error) {
        console.error("Erro ao tentar conectar ao banco de dados", error.message);
        process.exit(1);
    }
}

module.exports = connectDB;