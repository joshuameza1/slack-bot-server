/*
const server = require('./server');

server.listen(3000, () => console.log(`app listening at http://localhost:3000`));
*/

const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const port = 8000;

server.listen(port, function() {
  console.log("Server listening at port %d", port);
});

const client = "";

io.on("connection", socket => {
  console.log("New Client is Connected!");
  //console.log(socket);
  client = socket;
});