import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";
import { sendOtpEmail } from "../utils/sendOtpEmail.js";

const generateToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export const getMe = async (req, res) => {
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

        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        const newUsers = await User.create(
            [{
                email,
                password: hashedPassword,
                otp,
                otpExpiresAt: new Date(
                    Date.now() + 5 * 60 * 1000
                ),
                isVerified: false
            }],
            { session }
        );

        await sendOtpEmail(email, otp);

        res.status(201).json({
            success: true,
            message: "OTP sent successfully"
        });

        res.status(201).json({
            success: true,
            message: "User created Successfully",
            user: {
                _id: newUsers[0]._id,
                email: newUsers[0].email
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
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");

        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: "Email not verified",
                email: user.email,
            });
        }

        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: "Email not verified",
                email: user.email,
            });
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
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            success: true,
            message: "User signed in successfully",
            data: {
                token,
                user
            }
        });
    } catch (error) {
        next(error);
    }
};

export const signOut = async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
};

export const verifyOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (user.otpExpiresAt < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP expired",
            });
        }

        if (user.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiresAt = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const resendOtp = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        user.otp = otp;
        user.otpExpiresAt = new Date(
            Date.now() + 5 * 60 * 1000
        );

        await user.save();

        await sendOtpEmail(email, otp);

        res.status(200).json({
            success: true,
            message: "OTP resent successfully",
        });
    } catch (error) {
        next(error);
    }
};