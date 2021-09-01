'use strict';

const express = require('express');
const api = express.Router();

api.get('/', (req,res)=>{
  res.send({message: 'Hello World 2!'});
});


const app = express();
const server2 = require("http").createServer(app);
const io = require("socket.io")(server2);
const port = 8000;

server2.listen(port, function() {
  console.log("Server listening at port %d", port);
});

var client = "";

io.on("connection", socket => {
  console.log("New Client is Connected!");
  //console.log(socket);
  client = socket;
});


module.exports = api;

