'use strict';

const app = require('./server/app.js');
const app2 = require('./server/app2.js')
const config = require('./server/configDomain');
const config2 = require('./server/configDomain2');


app.listen(3000, () => console.log(`app listening at http://localhost:3000`));



const server2 = require("http").createServer(app2);
const io = require("socket.io")(server2);

server2.listen(8000, function() {
  console.log("Server listening at port 8000");
});

var client = "";

io.on("connection", socket => {
  console.log("New Client is Connected!");
  //console.log(socket);
  client = socket;
});