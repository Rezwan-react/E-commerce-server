const cloudinary = require("../helpers/cloudinary");
const generateRandomString = require("../helpers/generateRandomString");
const sendMail = require("../helpers/mail");
const { emailVerifyTemplates, resetPasswordTemplates } = require("../helpers/templates");
const { emailValidator } = require("../helpers/validators");
const userSchema = require("../modal/userSchema");
const jwt = require("jsonwebtoken");

// ================= Registration Controller 
const registration = async (req, res) => {
    const { name, email, password, address, phone, role, avatar } = req.body;

    try {
        //=========== Validate input
        if (!name) return res.status(400).send({ error: "Name is required!" });
        if (!email) return res.status(400).send({ error: "Email is required!" });
        if (!password) return res.status(400).send({ error: "Password is required!" });
        if (!phone) return res.status(400).send({ error: "Phone number is required!" });
        if (emailValidator(email)) return res.status(400).send({ error: "Email is not valid" });
        // =========== existing user check
        const existingUser = await userSchema.findOne({ email });
        if (existingUser) return res.status(400).send({ error: "Email already exist" });

        // =========== random otp generate
        const randomOtp = Math.floor(Math.random() * 9000);

        // =========== create user
        const user = new userSchema({
            name,
            email,
            password,
            address,
            phone,
            role,
            avatar,
            otp: randomOtp,
            otpExpiredAt: new Date(Date.now() + 5 * 60 * 1000)
        });

        user.save()
        // ========== email verification
        sendMail(email, "Verify your email", emailVerifyTemplates, randomOtp);

        res.status(200).send({ success: "Registration successful. Please verify your email." });
    } catch (error) {
        res.status(500).send({ error: "server error" });
    }
}

// ================ Verify Email Controller
const verifyEmailAddress = async (req, res) => {
    const { email, otp } = req.body;

    try {
        if (!email) return res.status(400).send({ error: "Invalid  email" });
        if (!otp) return res.status(400).send({ error: "Invalid otp" });

        const verifiedUser = await userSchema.findOne({
            email,
            otp,
            otpExpiredAt: { $gt: Date.now() },
        });
        if (!verifiedUser) return res.status(400).send({ error: "Invalid otp" });

        verifiedUser.otp = null;
        verifiedUser.otpExpiredAt = null;
        verifiedUser.isVarified = true;
        verifiedUser.save();

        res.status(200).send({ success: "email verified successfully" });
    } catch (error) {
        res.status(500).send({ error: "server error" });
    }
};

// ================ Login Controller
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email) return res.status(400).send({ error: "email is required" });
        if (emailValidator(email)) res.status(400).send({ error: "email is not valid" });
        if (!password) return res.status(400).send({ error: "password is required" });

        const existingUser = await userSchema.findOne({ email });
        if (!existingUser) return res.status(400).send({ error: "user not found" });
        const passCheck = await existingUser.isPasswordValid(password);
        if (!passCheck) return res.status(400).send({ error: "wrong password" });
        if (!existingUser.isVarified) return res.status(400).send({ error: "email is not varified" });

        // ========================= jwt token part start
        const accessToken = jwt.sign(
            {
                data: {
                    email: existingUser.email,
                    id: existingUser._id,
                    role: existingUser.role,
                },
            },
            process.env.JWT_SEC, { expiresIn: "5d" }
        );

        const loggedUse = {
            email: existingUser.email,
            _id: existingUser._id,
            name: existingUser.name,
            avatar: existingUser.avatar,
            isVarified: existingUser.isVarified,
            phone: existingUser.phone,
            address: existingUser.address,
            role: existingUser.role,
            createdAt: existingUser.createdAt,
            updatedAt: existingUser.updatedAt,
        };

        res.status(200).send({ success: "login Sussessfull", user: loggedUse, accessToken });
    } catch (error) {
        res.status(500).send({ error: "server error" });
    }
};

// ================ Forgat Password Controller
const forgatPassword = async (req, res) => {
    const { email } = req.body;

    try {
        if (!email) return res.status(400).send({ error: "email is required" });

        const existingUser = await userSchema.findOne({ email });
        if (!existingUser) return res.status(400).send({ error: "user not found" });
        // ============== generate random string for reset password
        const randomString = generateRandomString(30);

        existingUser.resetPasswordId = randomString;
        existingUser.resetPasswordExpiredAt = new Date(Date.now() + 10 * 60 * 1000);
        existingUser.save();

        sendMail(email, "Reset password", resetPasswordTemplates, randomString);

        res.status(201).send({ success: "check email" });
    } catch (error) {
        res.status(500).send({ error: "server error" });
    }
};

// ================ Reset Password Controller
const resetPassword = async (req, res) => {
    const { newPassword } = req.body;
    try {
        const randomString = req.params.randomstring;
        const email = req.query.email;

        const existingUser = await userSchema.findOne({ email, resetPasswordId: randomString, resetPasswordExpiredAt: { $gt: Date.now() }, });
        if (!existingUser) return res.status(400).send({ error: "Invalid request" });
        if (!newPassword) return res.status(400).send({ error: "input your new password" });
        existingUser.password = newPassword;
        existingUser.resetPasswordId = null;
        existingUser.resetPasswordExpiredAt = null;
        existingUser.save();

        res.status(200).send({ success: "reset password successfully" });
    } catch (error) {
        res.status(500).send({ error: "server error" });
    }
};

// ================ Update User Controller
const update = async (req, res) => {
    const { fullName, password } = req.body;
    try {
        const existingUser = await userSchema.findById(req.user.id);

        if (fullName) existingUser.fullName = fullName.trim().split(/\s+/).join(' ');
        if (password) existingUser.password = password;

        if (req?.file?.path) {
            if (existingUser.avatar) await cloudinary.uploader.destroy(existingUser.avatar.split('/').pop().split('.')[0]);
            const result = await cloudinary.uploader.upload(req.file.path, { folder: "avatar" });
            existingUser.avatar = result.url;
            fs.unlinkSync(req.file.path);
        }

        existingUser.save();

        res.status(200).send(existingUser);
    } catch (error) {
        res.status(500).send({ error: "server error" });
    }
};

module.exports = { registration, verifyEmailAddress, login, forgatPassword, resetPassword, update }