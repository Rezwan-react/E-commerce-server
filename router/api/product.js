const express = require('express');
const { createCategory, gatCategory } = require('../../controller/categoryController');
const upload = require('../../helpers/multer');
const roleCheck = require('../../middlewares/roleMiddleware');
const authMiddleware = require('../../middlewares/authMiddleware');
const router = express.Router();

router.post("/createcategory", authMiddleware, roleCheck(["admin"]), upload.single('category'), createCategory);
router.get("/categories", gatCategory);

module.exports = router;
