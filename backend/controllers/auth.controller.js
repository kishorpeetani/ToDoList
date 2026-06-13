import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";
import { sendOtpEmail } from "../utils/sendOtpEmail.js";
import { sendResetPasswordOtpEmail }
    from "../utils/sendResetPasswordOtpEmail.js";

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

    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            const error = new Error("Account already exists !!");
            error.statusCode = 409;
            throw error;
        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        await User.create(
            {
                email,
                password: hashedPassword,
                otp,
                otpExpiresAt: new Date(
                    Date.now() + 5 * 60 * 1000
                ),
                lastOtpSentAt: new Date(),
                isVerified: false
            },
        );

        await sendOtpEmail(email, otp);

        res.status(201).json({
            success: true,
            message: "OTP sent successfully"
        });
    }
    catch (error) {
        next(error);
    }
}

export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                code: "EMAIL_NOT_VERIFIED",
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

        user.password = undefined;

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
        code: "USER_MESSAGE",
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
                code: "USER_MESSAGE",
                message: "User not found",
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                code: "USER_MESSAGE",
                message: "Email already verified"
            });
        }

        if (
            !user.otpExpiresAt ||
            user.otpExpiresAt < new Date()
        ) {
            return res.status(400).json({
                success: false,
                code: "USER_MESSAGE",
                message: "OTP expired",
            });
        }

        if (!/^\d{6}$/.test(otp)) {
            return res.status(400).json({
                success: false,
                code: "USER_MESSAGE",
                message: "Invalid OTP format"
            });
        }

        if (user.otp !== otp) {
            return res.status(400).json({
                success: false,
                code: "USER_MESSAGE",
                message: "Invalid OTP",
            });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiresAt = undefined;
        user.lastOtpSentAt = undefined;

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
                code: "USER_MESSAGE",
                message: "User not found",
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                code: "USER_MESSAGE",
                message: "Email already verified"
            });
        }

        if (
            user.lastOtpSentAt &&
            Date.now() - user.lastOtpSentAt.getTime() < 30000
        ) {
            return res.status(429).json({
                success: false,
                code: "USER_MESSAGE",
                message:
                    "Please wait before requesting another OTP",
            });
        }

        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        user.otp = otp;

        user.otpExpiresAt = new Date(
            Date.now() + 5 * 60 * 1000
        );

        user.lastOtpSentAt = new Date();


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

export const forgotPassword = async (
    req,
    res,
    next
) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({
            email,
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                code: "USER_MESSAGE",
                message: "User not found",
            });
        }

        if (!user.isVerified) {
            return res.status(400).json({
                success: false,
                code: "EMAIL_NOT_VERIFIED",
                message:
                    "Please verify your email first",
                email: user.email,
            });
        }

        if (
            user.lastOtpSentAt &&
            Date.now() -
            user.lastOtpSentAt.getTime() <
            30000
        ) {
            return res.status(429).json({
                success: false,
                code: "USER_MESSAGE",
                message:
                    "Please wait before requesting another OTP",
            });
        }

        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        user.otp = otp;

        user.otpExpiresAt = new Date(
            Date.now() + 5 * 60 * 1000
        );

        user.lastOtpSentAt = new Date();

        await user.save();

        await sendResetPasswordOtpEmail(
            email,
            otp
        );

        res.status(200).json({
            success: true,
            message:
                "Password reset OTP sent",
        });
    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (
    req,
    res,
    next
) => {
    try {
        const {
            email,
            otp,
            newPassword,
        } = req.body;

        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                code: "USER_MESSAGE",
                message:
                    "Password must be at least 6 characters",
            });
        }

        const user = await User.findOne({
            email,
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                code: "USER_MESSAGE",
                message: "User not found",
            });
        }

        if (!/^\d{6}$/.test(otp)) {
            return res.status(400).json({
                success: false,
                code: "USER_MESSAGE",
                message:
                    "Invalid OTP format",
            });
        }

        if (
            !user.otpExpiresAt ||
            user.otpExpiresAt < new Date()
        ) {
            return res.status(400).json({
                success: false,
                code: "USER_MESSAGE",
                message: "OTP expired",
            });
        }

        if (user.otp !== otp) {
            return res.status(400).json({
                success: false,
                code: "USER_MESSAGE",
                message: "Invalid OTP",
            });
        }

        const salt =
            await bcrypt.genSalt(10);

        user.password =
            await bcrypt.hash(
                newPassword,
                salt
            );

        user.otp = undefined;
        user.otpExpiresAt = undefined;
        user.lastOtpSentAt = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message:
                "Password reset successful",
        });
    } catch (error) {
        next(error);
    }
};