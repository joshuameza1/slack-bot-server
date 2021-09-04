/* request-handler.js */
module.exports = function (client) {
  // registration related behaviour goes here...
  client.emit("hello", "world");
};