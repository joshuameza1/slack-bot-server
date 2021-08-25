//const server = require('./server');

//server.listen(3000, () => console.log(`app listening at http://localhost:3000`));


var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = 8000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static('public'));


io.on("connection", (socket) => {
    //Socket is a Link to the Client 
    socket.emit("hello", "world");
    console.log("New Client is Connected!");
    //Here the client is connected and we can exchanged 
});