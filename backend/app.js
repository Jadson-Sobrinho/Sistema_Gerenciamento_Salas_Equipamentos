const express = require('express');
const app = express();
const cors = require('cors');              
const path = require('path'); 


const usuariosRoute = require('./routes/user');
const salasRoute = require('./routes/resource');
const reservaRoute = require('./routes/reserve');
const authRoute = require('./routes/auth.js');

app.use(cors());                          
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/src/pages')));
app.use('/style', express.static(path.join(__dirname, '../frontend/src/pages/styles')));
app.use('/script', express.static(path.join(__dirname, '../frontend/src/pages/script')));
app.use('/img', express.static(path.join(__dirname, '../frontend/public/img')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/src/pages/login.html'));
});

app.get('/index-form', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/src/pages/index.html'));
});

app.get('/room-form', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/src/pages/resource.html'));
});

app.get('/user-form', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/src/pages/user.html'));
});

app.get('/login-form', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/src/pages/login.html'));
});

app.get('/userReserves-form', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/src/pages/userReserves.html'));
});

app.get('/reserve-form', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/src/pages/reserve.html'));
});

app.get('/reservesToApprove-form', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/src/pages/reservesToApprove.html'));
});


app.use('/auth', authRoute);
app.use('/user', usuariosRoute);
app.use('/room', salasRoute);
app.use('/reserve', reservaRoute);

module.exports = app;