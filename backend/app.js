const express = require('express');
const app = express();
const cors = require('cors');              
const path = require('path'); 

const usuariosRoute = require('./routes/user');
const salasRoute = require('./routes/resource');
const reservaRoute = require('./routes/reserve');

app.use(cors());                          
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/src/pages')));


app.get('/reserve-form', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/src/pages/index.html'));
});

app.get('/room-form', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/src/pages/resource.html'));
});

app.get('/user-form', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/src/pages/user.html'));
});

app.use('/user', usuariosRoute);
app.use('/room', salasRoute);
app.use('/reserve', reservaRoute);

module.exports = app;