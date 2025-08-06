import express from "express";
import {registerUser , loginUser, getProfile} from '../controllers/authcontroller';
import protect from "../middleware/authmiddleware"
const router = express.Router();

//routes
router.post('/register',registerUser)
router.post('/login',loginUser)

//protected route
router.get('/profile',protect,getProfile)

export default router;