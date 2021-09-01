'use strict';

const app = require('./server/app.js');
const app2 = require('./server/app2.js');

                     
app.listen(3000, () => console.log(`app listening at http://localhost:3000`));

app2.listen(8000, () => console.log(`Server listening at port 8000`));