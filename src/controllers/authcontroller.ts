import {Request, Response} from "express";
import User from "../models/user"
import {generateAccessToken, generateRefreshToken} from '../utils/generateToken.js';

export const registerUser = async(req:Request,res:Response): Promise<void> => {
    try{
        const {name,email,password} = req.body;

        //validation
        if(!name||!email||!password){
            res.status(400).json({message:"All fields are required"});
        }
    }
catch(err){
    console.log("error",err)
}
    //validate input
}