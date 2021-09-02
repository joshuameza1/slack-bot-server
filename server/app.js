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
const io = require("socket.io")(httpServer, options);
const getClient = function(server) {
    var io = require('socket.io').listen(server);
    io.sockets.on('connection', function (socket) {
        //How to expose the socket here to other JS methods using socket. Emit?
        socket.emit("hello", "world");
    });
    return io;
};

//Export Modules

module.exports = app;
module.exports = httpServer;

