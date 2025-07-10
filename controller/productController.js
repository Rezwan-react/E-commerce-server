const productSchema = require("../modal/productSchema");
const cloudinary = require("../helpers/cloudinary");
const fs = require("fs");

// ========== Create Product
const createProduct = async (req, res) => {
    const { title, description, price, stock, category, variants } = req.body;

    // ========= Main Image Upload
    let mainImg;
    for (item of req.files.mainImg) {
        const result = await cloudinary.uploader.upload(item.path, {
            folder: "products",
        });
        fs.unlinkSync(item.path);
        mainImg = result.url;
    }

    console.log(req.files); return
    // ======== Validation
    if (!title) return res.status(400).send({ message: "Title is required" });
    if (!description) return res.status(400).send({ message: "Description is required" });
    if (!price) return res.status(400).send({ message: "Price is required" });
    if (!stock) return res.status(400).send({ message: "Stock is required" });
    if (!category) return res.status(400).send({ message: "Category is required" });
    if (variants.length < 1) return res.status(400).send({ message: "Add minimum one variant" });
    if (!req.files.mainImg) return res.status(400).send({ message: "Main image is required" });



    // ========== Variant Validation
    variants.forEach(items => {
        // ========== Variant enum Validation
        if (!["color", "size"].includes(items.name)) {
            return res.status(400).send({ message: "Invalid variant enum" });
        }
        // ========== Variant Color Validation
        if (items.name === "color") {
            items.options.forEach(clorOption => {
                if (!clorOption.hasOwnProperty("colorname")) {
                    return res.status(400).send({ message: "Color name is required" });
                }
            });
        }
        // ========== Variant Size Validation
        if (items.name === "size") {
            items.options.forEach(sizeOption => {
                if (!sizeOption.hasOwnProperty("size")) {
                    return res.status(400).send({ message: "Size is required" });
                }
            });
        }
    });

    const product = new productSchema({
        title,
        description,
        price,
        stock,
        category,
        variants,
        mainImg,
    });

    product.save();

    res.status(201).send({ message: "Product created successfully", product });

}

module.exports = { createProduct }