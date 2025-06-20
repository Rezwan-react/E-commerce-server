const express = require('express');
const { registration, login, verifyEmailAddress, forgatPassword, resetPassword, update } = require('../../controller/authController');
const authMiddleware = require('../../middlewares/authMiddleware');
const upload = require('../../helpers/multer');
const roleCheck = require('../../middlewares/roleMiddleware');
const router = express.Router();

router.post("/registration", registration);
router.post("/verifyEmail", verifyEmailAddress);
router.post("/login", login);
router.post("/forgatPassword", forgatPassword);
router.post("/resetPassword/:randomstring", resetPassword);
router.post("/update", authMiddleware, roleCheck(["user", "admin", "stuff"]), upload.single('avatar'), update);


module.exports = router