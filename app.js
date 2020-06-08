const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

//import routes
const authRoute = require('./routes/auth');

dotenv.config();

///connect to DB
mongoose.connect(process.env.DB_CONNECT , 
    { useNewUrlParser: true },
    () => {
    console.log('connected to db')
});

///body parser
app.use(express.json());







///Route middleware
app.use('/auth', authRoute);



app.listen(5000, () => console.log('server is running'));