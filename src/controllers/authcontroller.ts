import user from '../models/user.js'
import bcrypt from 'bcryptjs';

import {generateAccessToken, generateRefreshToken} from '../utils/generateToken.js';

export const register = async(req,res,next) => {
    try{
        const {name,email,pass} = req.body;
    }

    //validate input
    if
}