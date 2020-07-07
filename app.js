const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

//import routes
const authRoute = require('./routes/auth');
const mainRoute = require('./routes/workout');
const userRoute = require('./routes/user');




const port = process.env.PORT || 5000;

var cors = require("cors");
app.use(cors());


dotenv.config();


///connect to DB
mongoose.connect(process.env.MONGODB_URI || process.env.DB_CONNECT  , 
    { useNewUrlParser: true, useUnifiedTopology: true},
    () => {
    console.log('connected to db')
});

///body parser
app.use(express.json());

///Route middleware
app.use('/workouts', mainRoute);
app.use('/auth', authRoute);
app.use('/user', userRoute);


///heroku
    app.use(express.static('./frontend/build'));
    app.get('*', (req, res)  => {
        res.sendFile(path.join(__dirname, '/frontend/build/index.html'));
    })




app.listen(port, () => console.log('server is running'));