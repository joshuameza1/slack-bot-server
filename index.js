'use strict';
const app = require('./server/app.js');

//Start Slack Communication Server
app.listen(process.env.PORT || 3000, () => console.log(`app listening at port 3000`));
