const express = require('express');
const app = express();

const usuariosRoute = require('./routes/user');
const salasRoute = require('./routes/resource');
const reservaRoute = require('./routes/reserve');

app.use(express.json());
app.use('/user', usuariosRoute);
app.use('/room', salasRoute);
app.use('/reserve', reservaRoute);

module.exports = app;