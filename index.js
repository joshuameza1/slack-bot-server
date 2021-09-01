'use strict';

const app = require('./server/app.js');
const app2 = require('./server/app2.js')
const config = require('./server/configDomain');
const config2 = require('./server/configDomain2');


app.listen(config.port, () => console.log(`app listening at http://localhost:3000`));


app2.listen(config2.port, () => console.log(`Server listening at port 8000`));