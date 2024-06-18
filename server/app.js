const express=require("express");
const app=express();
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config()
const port=process.env.PORT || 5001
const cookieParser = require('cookie-parser');

//data base connection
require('./db/conn');

app.use(cors());

app.use(express.json());
app.use(cookieParser());


//we make the router file to make route easy
app.use(require('./router/auth'));



app.listen(port,()=>{
    console.log(`server is runing at http://localhost:${port}`)
})

