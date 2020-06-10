const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

//import routes
const authRoute = require('./routes/auth');
const mainRoute = require('./routes/workout');
const userRoute = require('./routes/user');


var cors = require("cors");
app.use(cors());


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
app.use('/workouts', mainRoute);
app.use('/auth', authRoute);
app.use('/user', userRoute);



app.listen(5000, () => console.log('server is running'));