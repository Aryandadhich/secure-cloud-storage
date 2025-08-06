//main entry point load express connect db and set routes

import express from 'express';
import connectDB from './config/db'
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";

//load enviroment variables
dotenv.config(); //load variable from .env file 

//connect to mongo
connectDB();

//initialize express
const app = express();
app.use(express.json()); //parse incoming json
app.use(cookieParser()); //helps your app read cookies sent by browser - middleware to parse cookies

//Routes 
app.use('/api/auth',authRoutes);

//health check route(Optional)
app.get('/',(_req,res)=>{
    res.send("API is running");
})

app.listen( process.env.PORT|| 5000, ()=>{
    console.log(`server running on ${process.env.PORT}`)
});