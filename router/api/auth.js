const express = require('express');
const { registration, login, verifyEmailAddress } = require('../../controller/authController');
const router = express.Router();

router.post("/registration", registration);
router.post("/verifyEmail", verifyEmailAddress);
router.post("/login", login);





module.exports = router