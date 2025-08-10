import {Request, Response} from "express";
import User from "../models/user" //user model to interect with mongodb
import {generateAccessToken, generateRefreshToken} from '../utils/generateToken';
import validator from 'validator';


// Register

export const registerUser = async(req:Request,res:Response) => {
    try{
        //validation
        //normalize and trim input
        const rawName = (req.body.name ?? "").toString(); //force it to string so we dont get erors
        const rawEmail = (req.body.email ?? "").toString();
        const rawPassword = (req.body.password ?? "").toString();

        const name = rawName.trim(); //remove leading/trailing space from name 
        
        //normalize email to a consistant format (ex - lowecase domain , emove dots in Gmail)
        const email = (validator.normalizeEmail(rawEmail) || rawEmail).trim().toLowerCase();


        const password = rawPassword.trim();  //remove space from password
        
        //basic presence
        if(!name||!email||!password){
            res.status(400).json({message:"All fields are required"});
            return;
        }
        if (!/^[a-zA-Z\s]{3,50}$/.test(name)) {
  return res.status(400).json({ message: "Name must be 3-50 characters and contain only letters" });
}

         if (name.length > 100) {
               return res.status(400).json({ message: "name too long (max 100 chars)" });
    }
    if (email.length > 254) {
       return res.status(400).json({ message: "email too long" });
    }

    // validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "invalid email format" });
    }

    // password strength (configurable)
    const passwordOptions = {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 0, // set to 1 if you want stricter
      minNumbers: 1,
      minSymbols: 0,   // set to 1 for stricter
    };
    if (!validator.isStrongPassword(password, passwordOptions)) {
        return res.status(400).json({
        message: "password too weak (min 8 chars, include numbers)",
      });
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


        //set access token in cookie
         res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 15 * 60 * 1000 // 15 minutes
        });

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
        });
    }
catch(error : any ){
    console.log("Register error",error);

    //duplicate key (race) - 
    if(error.code === 11000 && error.keyPattern?.email){
        return res.status(400).json({message: "Email alredy in use"});
    }
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
        const ExistingUser = await User.findOne({email}).select('+password');
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

        //set access token in cookie
         res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 15 * 60 * 1000 // 15 minutes
        });

         //set Refresh Token in cookie
         res.cookie("refreshToken",refreshToken, {
            httpOnly : true,
            secure : process.env.NODE_ENV === "production",
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

//protected route for (/profile or /me)
//this is not rbac its authentication based access - only logged in user can access
//we use protect middleware to allow only logged in user to access this route
export const getProfile = async(req: Request,res: Response)=>{
    try{
        //req.user set by protected middleware
        const user = (req as any).user;

        res.status(200).json({
            id : user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    }catch(error){
        res.status(500).json({message: " failed to fetch profile"})
    }
};