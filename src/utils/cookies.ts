//cookie helper

import {Response} from "express";

export const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    samesite: "strict",
    path: "/"
};

export function setAuthCookies (res: Response,accessToken : string, refreshToken: string) {
    //access - short life
    res.cookie("accessToken", accessToken, {
        ...COOKIE_OPTIONS,
        maxAge: 15*60*1000, //15 minutes
    });

    //Refresh - longer life
    res.cookie("refreshToken",refreshToken,{
        ...COOKIE_OPTIONS,
        maxAge : 7*24*60*60*1000,
    });
}