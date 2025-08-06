//Only logged-in users with a valid jwt token can upload or access routes and files.
//The token is validated on each private request.
//If token is missing/invalid, access is denied.

import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import User from "../models/user";

//extending default request type from express.
//why ?  because we are adding a new property  (user) to req.
//the user will hold the decoded jwt data (ex. user Id, email , role).
interface AuthRequest extends Request {
    user?: any;
}


//define the protect middleware function
const protect = async (req:AuthRequest, res: Response, next: NextFunction) => {
   
    let token; //to store jwt token if found

    //check if token exist in cookies
    if(req.cookies && req.cookies.accessToken){
        try{
        token = req.cookies.accessToken;

        //verify token from .env file
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

        // fetch user from DB using ID from token
      const user = await User.findById((decoded as any).id).select("-password");
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user; //attach full user to request
        next(); //continue to actual route
    }catch(error){ 
        return res.status(401).json({message:"not autorised invalid token"});
    }
}else{
        return res.status(401).json({message:"not authorised no token"})
    }
};

export default protect;
