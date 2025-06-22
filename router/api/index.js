const express = require('express')
const router = express.Router();
const authRouter = require("./auth")
const productRouter = require("./product")

// ========== API Auth Routes
router.use("/auth", authRouter)

// ========== API product Routes
router.use("/product", productRouter)



module.exports = router