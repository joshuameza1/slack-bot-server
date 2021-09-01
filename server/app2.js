const express = require("express");
const app = express();
const routes = require('../routes/routes2.js');

app.use('/',routes)

module.exports = app;

