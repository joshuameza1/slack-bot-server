const express = require('express');
const bodyParser = require('body-parser');
const routes = require('../routes/routes.js');

//Slack Communication Server

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({ message: 'The app is running...'})
})

app.use('/api', routes);


//Socket IO Server

const httpServer = require("http").createServer(app);
const options = { /* ... */ };

const socket = function(server) {
    const io = require("socket.io")(httpServer, options);
  
    io.on("connection", socket => {
      console.log("New Client is Connected!");
      // console.log(socket);
      //socket.emit("hello", "world");
    });
    return io;

};


//Export Modules

module.exports = {
  httpServer,
  socket
}