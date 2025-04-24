const express = require('express');
const app = express();

const usuariosRoute = require('./routes/user');
const salasRoute = require('./routes/resource');

app.use(express.json());
app.use('/user', usuariosRoute);
app.use('/room', salasRoute);

module.exports = app;