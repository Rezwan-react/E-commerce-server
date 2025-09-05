const express = require('express');
const authMiddleware = require('../../middlewares/authMiddleware');
const { addNewOrder, updateOrder } = require('../../controller/orderControllers');
const roleCheck = require('../../middlewares/roleMiddleware');
const router = express.Router();

router.post("/create", authMiddleware, addNewOrder)
router.post("/updatestatus/:orderId", authMiddleware, roleCheck(["admin", "stuff"]), updateOrder);

module.exports = router