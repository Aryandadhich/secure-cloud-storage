import jwt from "jsonwebtoken";

//Access Token
export const generateAccessToken = (userId : string) : string => {
    return jwt.sign({id: userId}, process.env.JWT_SECRET as string, {expiresIn:'15m'});
}

//Refreshj Token
export const generateRefreshToken = (userId: string): string => {
    return jwt.sign({id: userId}, process.env.JWT_REFRESH_SECRET as string, {expiresIn: '7d'});
}