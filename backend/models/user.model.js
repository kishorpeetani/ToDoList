import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowercase : true,
        match :  [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter valid email"]
    },
    password : {
        type : String,
        required : true,
        select : false,
        minLength : 4
    },
    otp: {
        type: String,
    },
    otpExpiresAt: {
        type: Date,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    role : {
        type : String,
        enum : ["user", "admin"],
        default : "user"
    }
}, { timestamps : true});

const User = mongoose.model('User', userSchema);

export default User;