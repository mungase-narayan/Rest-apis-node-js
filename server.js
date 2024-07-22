const express = require('express');
const { APP_PORT } = require('./config');
const {DB_URL} = require('./config')
const path = require('path');


const app =  express();
const router = require("./routes/index");
const errorHandler = require('./middlewares/errorHandler');
const { mongoose } = require('mongoose');

// Database Connection
mongoose.connect(DB_URL);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB')
});

app.use("/uploads", express.static("uploads"));
global.appRoot = path.resolve(__dirname);
app.use(express.urlencoded({extended: false}));

app.use(express.json());
app.use('/api', router);


app.use(errorHandler); 
app.listen(APP_PORT, () => console.log(`listening on port ${APP_PORT}`));
