const express = require('express');
const { APP_PORT } = require('./config');


const app =  express();
const router = require("./routes/index");
const errorHandler = require('./middlewares/errorHandler');

app.use(express.json());
app.use('/api', router)
app.use(errorHandler); 
 
app.listen(APP_PORT, () => console.log(`listening on port ${APP_PORT}`));
