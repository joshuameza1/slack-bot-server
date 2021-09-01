const slack_server = require('./server/slack_index.js');

const socket_server = require('./server/socket_index.js');

socket_server.listen(3000, () => console.log(`app listening at http://localhost:3000`));

const io = require("socket.io")(socket_server);

socket_server.listen(8000, function() {
  console.log("Server listening at port: 8000");
});

var client = "";

io.on("connection", socket => {
  console.log("New Client is Connected!");
  //console.log(socket);
  client = socket;
});

