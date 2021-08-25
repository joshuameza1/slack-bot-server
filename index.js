const server = require('./server');

//server.listen(3000, () => console.log(`app listening at http://localhost:3000`));

const express = require("express");
const app = express();
const port = 3000;
const http = require("http").createServer("https://plump-spiffy-stargazer.glitch.me");
const io = require("socket.io")(http);
//Listen for a client connection 
io.on("connection", (socket) => {
    //Socket is a Link to the Client 
    console.log("New Client is Connected!");
    //Here the client is connected and we can exchanged 
});

//Listen the HTTP Server 
http.listen(port, () => {
    console.log("Server Is Running Port: " + port);
});
