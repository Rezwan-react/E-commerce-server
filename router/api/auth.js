const express = require('express');
const { registration } = require('../../controller/authController');
const router = express.Router();

router.get("/registration", registration);





module.exports = router