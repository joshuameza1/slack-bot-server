const express = require('express');
const bodyParser = require('body-parser');
const routes = require('../routes/routes.js');
var handleRequest = require('../handlers/request.js');

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
const io = require("socket.io")(httpServer, options);



io.on("connection", client => {
  console.log("New Client is Connected!");
  handleRequest(client);
  // console.log(socket);
  //socket.emit("hello", "world");
});


//Export Modules

module.exports = {
  httpServer,
  io
}