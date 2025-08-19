const express = require('express')
const router = express.Router();
const authRouter = require("./auth")
const productRouter = require("./product")
const orderRouter = require("./order")

// ========== API Auth Routes
router.use("/auth", authRouter)

// ========== API product Routes
router.use("/product", productRouter)

// ============== order Routes
router.use("/order", orderRouter)

module.exports = router