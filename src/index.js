const express = require('express');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const cors = require('cors');
const cookieParser = require('cookie-parser')
require('dotenv').config({path: '../.env'});


const Routes = require('./routes/routes');

const API = express();
API.use(cookieParser());
API.use(cors());

//middleware
API.use(express.json());
API.use('/API', Routes);

API.get('/', (req,res)=>{
    res.send('hello!');
});

//mongodb connection
mongoose.connect(process.env.MONGODB_URI)
    .then(()=>console.log('connected to MONGODB atlas'))
    .catch((error)=>console.log(error));

API.listen(27017, () => console.log('listening in port 27017'));