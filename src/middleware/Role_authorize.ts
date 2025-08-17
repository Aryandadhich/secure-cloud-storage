//authentication - who you are (valid user ?)
//authorization - what you're allowed to do (roles/permission)

import {Request , Response, NextFunction} from 'express';

//extend express request type to include our user 

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const roleAuthorize = (allowedRoles: string[]) => {
     return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try{
        //check first if jwt middleware added req.user
        if(!req.user){
          return res.status(401).json({
            success : false,
            message : "unauthorised: No user info"
          });
        }
        const {role} = req.user;

        //Superadmin bypass
        if(role === 'superadmin'){
            return next();
        }

        //check if user role is allowed roles
        if(!allowedRoles.includes(role)){
            return res.status(403).json({
                success : false,
                message : "Forbidden : you dont have access to this resource"
            });
        }
        next();
      }
      catch(error){
        console.error('RBAC error', error);
        res.status(500).json({
            success : false,
            message : 'internal server error in role authorization'
        });
      }
};
};