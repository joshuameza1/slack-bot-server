'use strict';

const express = require('express');
const app = express();
const server = require("http").createServer(app);
const router = express.Router();

const io = require("socket.io")(server);


io.on("connection", socket => {
  console.log("New Client is Connected!");
  //console.log(socket);
  //client = socket;
});

module.exports = router;

