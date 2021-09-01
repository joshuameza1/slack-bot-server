const express = require('express');
const routes = require('../routes/routes2.js');

const app = express();

app.use('/',routes)

module.exports = app;

