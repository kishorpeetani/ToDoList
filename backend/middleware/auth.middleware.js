import { JWT_SECRET } from "../config/env.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const authorize = async(req, res, next)=>{
    try{
        const token = req.cookies.token;

        if(!token){
            return res.status(401).json({ code: "USER_MESSAGE", message : "Unauthorised access"});
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.userId);

        if(!user) return res.status(401).json({ code: "USER_MESSAGE", message : "Unauthorised access"});

        req.user = user;

        next();
    }
    catch(error){
        res.status(401).json({
            success : false,
            code: "USER_MESSAGE",
            message : "Unauthorised access",
        });
    }
};

export const isAdmin = async(req, res, next)=>{
    if(!req.user || req.user.role !== "admin"){
        return res.status(401).json({ code: "USER_MESSAGE", message : "Access denied" });
    }

    next();
}