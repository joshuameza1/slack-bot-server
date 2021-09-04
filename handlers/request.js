const io = require("socket.io-client");
let socket = io("https://lyrical-oasis-bathtub.glitch.me");

module.exports = socket;