const server = require('./server/slack_index.js');



server.listen(3000, () => console.log(`app listening at http://localhost:3000`));



const server2 = require("http").createServer(server2);
const io = require("socket.io")(sserver2);
const port = 8000;

sserver2.listen(port, function() {
  console.log("Server listening at port %d", port);
});

var client = "";

io.on("connection", socket => {
  console.log("New Client is Connected!");
  //console.log(socket);
  client = socket;
});

