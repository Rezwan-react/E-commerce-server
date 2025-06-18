const e = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        default: null
    },
    phone: {
        type: Number,
        required: true
    },
    role: {
        type: String,
        default: 'user',
        enum: ["user", "admin", "stuff"]
    },
    avatar: {
        type: String,
        default: "",
    },
    otp: {
        type: String,
    },
    otpExpiredAt: {
        type: Date,
    },
    isVarified: {
        type: Boolean,
        default: false,
    },
    resetPassId: {
        type: String
    },
    resetPassExpiredAt: {
        type: Date,
    },
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);