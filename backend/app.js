const express = require('express');
const app = express();

const usuariosRoute = require('./routes/user');

app.use(express.json());
app.use('/user', usuariosRoute);

module.exports = app;