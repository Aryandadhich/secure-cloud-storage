//main entry point load express connect db and set routes

import express from 'express';
import connectDB from './config/db'
import dotenv from 'dotenv';

//load enviroment variables
dotenv.config();

//connect to mongo
connectDB();

//initialize express
const app = express();
app.use(express.json());

app.get('/',(req,res)=>{
    res.send("API is running");
})

app.listen( process.env.PORT|| 5000, ()=>{
    console.log(`server running on ${process.env.PORT}`)
});