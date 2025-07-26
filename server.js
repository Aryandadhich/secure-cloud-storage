//main entry point load express connect db and set routes

const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./config/db')
connectDB();