import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";

const generateToken = (userId)=>{
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn : JWT_EXPIRES_IN});
}

export const getMe = async(req, res)=>{
    res.status(200).json({
        success: true,
        user: req.user
    });
}

export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            const error = new Error("Existing User !!");
            error.statusCode = 409;
            throw error;
        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        const newUsers = await User.create([{ email, password: hashedPassword }], { session });

        const token = generateToken(newUsers[0]._id);

        await session.commitTransaction();
        session.endSession();

        res.cookie("token", token, {
            httpOnly : true,
            secure: false,
            sameSite : "lax",
            maxAge : 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            success: true,
            message: "User created Successfully",
            user : {
                _id : newUsers[0]._id,
                email : newUsers[0].email
            }
        });
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

export const signIn = async (req, res, next) => {
    try{
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            const error = new Error("Invalid password");
            error.statusCode = 401;
            throw error;
        }

        const token = generateToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge : 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            success: true,
            message: "User signed in successfully",
            data: {
                token,
                user
            }
        });
    }catch(error){
        next(error);
    }
};

export const signOut = async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
};