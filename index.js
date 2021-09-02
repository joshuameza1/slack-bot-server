'use strict';

const app = require('./server/app.js');
const app2 = require('./server/app2.js');

                     
app.listen(3000, () => console.log(`app listening at port 3000`));

app2.listen(8000, () => console.log(`app 2 listening at port 8000`));