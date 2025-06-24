const mongoose = require("mongoose");
require("dotenv").config();


async function connectDB() {
    try{
        await mongoose.connect("mongodb+srv://jadson:"+ process.env.PASSWORD +"@unex.f468b.mongodb.net/?retryWrites=true&w=majority&appName=UNEX");

        console.log("Conectado ao banco!");
    } catch (error) {
        console.error("Erro ao tentar conectar ao banco de dados", error.message);
        process.exit(1);
    }
}

module.exports = connectDB;