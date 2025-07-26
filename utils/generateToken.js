import jwt from "jsonwebtoken";

//Access Token
export const generateAccessToken = (userID) => {
    return jwt.sign({id: userId}, process.env.JWT_SECRET, {expiresIn:'15m'});
}

//Refreshj Token
export const generateRefreshToken = (userID) => {
    return jwt.sign({id: userId}, process.env_Refresh_SECRET, {expireIn: '7d'});
}