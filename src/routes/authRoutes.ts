import express from "express";
import {registerUser , loginUser} from '../controllers/authcontroller';

const router = express.Router();

//routes
router.post('/register',registerUser)
router.post('/login',loginUser)

export default router;