import {Request, Response} from "express";
import User from "../models/user" //user model to interect with mongodb
import {generateAccessToken, generateRefreshToken} from '../utils/generateToken';

export const registerUser = async(req:Request,res:Response): Promise<void> => {
    try{
        const {name,email,password} = req.body;

        //validation
        if(!name||!email||!password){
            res.status(400).json({message:"All fields are required"});
            return;
        }
        
        //check if user is alredy exist
        const UserExists = await User.findOne ({email});
        if(UserExists){
            res.status(400).json({message : " User alredy exists"});
            return;
        }

        // Create New User (paas is alredy hashed in model pre save hook)
        const user = await User.create({
            name,email,password,
        });

        //Generate Token 
        const accessToken = generateAccessToken(user.id);
        const RefreshToken = generateRefreshToken(user.id);

        //Set refresh token in HTTP-only Cookie
        res.cookie("refreshtoken",RefreshToken,{
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite : "strict", //protect against cross site requests
            maxAge : 7*24*60*60*1000 //7 days
        });

        //Return user data & token
        res.status(201).json({
            message:"User registerd successfully",
            user:{
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            accessToken,
        });
    }
catch(error : any ){
    console.log("Register error",error);
    res.status(500).json({message: "Internal server error"})
}
}
//login

  export const loginUser = async (req: Request, res:Response) : Promise<void> => {
     try{
        const {email,password} = req.body;

        //validate input
        if(!email || !password) {
            res.status(400).json({message: "Email and password are required"});
            return;
        }

        //check if user exist
        const ExistingUser = await User.findOne({email})
         if(!ExistingUser){
            res.status(401).json({message:"invalid credentials"})
            return;
         }

         //check password using matchpassword method from schema
         const isMatch = await  ExistingUser.matchPassword(password);
         if(!isMatch){
            res.status(401).json({message:"invalid passwords"});
            return;
         }

         //Generate Token
         const accessToken = generateAccessToken(ExistingUser.id);
         const refreshToken = generateRefreshToken(ExistingUser.id)

         //set Refresh Token in cookie
         res.cookie("refreshToken",refreshToken, {
            httpOnly : true,
            secure : process.env.NODE_ENV === " Production",
            sameSite : "strict",
            maxAge : 7*24*60*60*1000
         })

         //return user data and token
         res.status(200).json({
            message:"Login Successful",
            user:{
                id: ExistingUser.id,
                name: ExistingUser.name,
                email: ExistingUser.email,
                role: ExistingUser.role
            },
            accessToken,
         });
     }
     catch(error: any){
        console.error("Login error", error);
        res.status(500).json({message:"Internal server error"});
     }
}
