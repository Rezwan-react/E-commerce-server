const express = require('express');
const { createCategory, gatCategory } = require('../../controller/categoryController');
const upload = require('../../helpers/multer');
const roleCheck = require('../../middlewares/roleMiddleware');
const authMiddleware = require('../../middlewares/authMiddleware');
const { createProduct, updateProduct, getAllProducts, deleteProduct } = require('../../controller/productController');
const router = express.Router();

// ========== Category Routes 
router.post("/createcategory", authMiddleware, roleCheck(["admin"]), upload.single('category'), createCategory);
router.get("/categories", gatCategory);

// ========== Product Routes
router.post("/create", upload.fields([{ name: "mainImg", maxCount: 1 }, { name: "images", maxCount: 8 },]), createProduct);
// ========== update Product Routes
router.post("/update/:slug", upload.fields([{ name: "mainImg", maxCount: 1 }, { name: "images", maxCount: 8 },]), updateProduct);

// ============ products list public routes
router.get("/productslist", getAllProducts);
// =========== delete product routes
router.delete("/deleteProduct/:productID", authMiddleware, roleCheck(["admin"]), deleteProduct);

module.exports = router;
