const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

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

// =========== Password Hashing
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();

});
// ============ password validation
userSchema.methods.isPasswordValid = async function (password) {
    return await bcrypt.compare(password, this.password);
}

module.exports = mongoose.model("User", userSchema);