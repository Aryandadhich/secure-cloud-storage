//main entry point load express connect db and set routes

import express, {Application} from 'express';
import connectDB from './config/db'
import dotenv from 'dotenv';

//load enviroment variables
dotenv.config();

//initialize express
const app: Application = express();
app.use(express.json());

//connect to mongo
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`server running on ${PORT}`)
});