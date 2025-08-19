const express = require('express');
const authMiddleware = require('../../middlewares/authMiddleware');
const { addNewOrder } = require('../../controller/orderControllers');
const router = express.Router();

router.post("/create", authMiddleware, addNewOrder)

module.exports = router