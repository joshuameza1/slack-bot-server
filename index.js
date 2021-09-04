'use strict';

const express = require('express');
const app = require('./server/app.js');
const app2 = express();

//Start Slack Communication Server
app.httpServer.listen(3000, () => console.log(`app listening at port 3000`));

//Start Socket IO Server
app2.listen(8000, () => console.log(`app 2 listening at port 8000`));
