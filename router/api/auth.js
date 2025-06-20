const express = require('express');
const { registration, login, verifyEmailAddress, forgatPassword, resetPassword } = require('../../controller/authController');
const router = express.Router();

router.post("/registration", registration);
router.post("/verifyEmail", verifyEmailAddress);
router.post("/login", login);
router.post("/forgatPassword", forgatPassword);
router.post("/resetPassword/:randomstring", resetPassword);



module.exports = router