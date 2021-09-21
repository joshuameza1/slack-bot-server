const io = require("socket.io-client");
let socket = io(process.env.SOCKET_IO_SERVER || "https://lyrical-oasis-bathtub.glitch.me");

module.exports = socket;