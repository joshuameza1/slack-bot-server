const io = require("socket.io-client");
let socket = io("https://socket-io-server-heroku.herokuapp.com");

module.exports = socket;