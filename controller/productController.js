const productSchema = require("../modal/productSchema");
const cloudinary = require("../helpers/cloudinary");
const generateSlug = require("../helpers/slugGerarator");
const fs = require("fs");

// ========== Create Product
const createProduct = async (req, res) => {
    const { title, description, price, stock, category, variants } = req.body;

    try {
        // ======== Validation
        if (!title) return res.status(400).send({ message: "Title is required" });
        if (!description) return res.status(400).send({ message: "Description is required" });
        if (!price) return res.status(400).send({ message: "Price is required" });
        if (!stock) return res.status(400).send({ message: "Stock is required" });
        if (!category) return res.status(400).send({ message: "Category is required" });
        if (variants.length < 1) return res.status(400).send({ message: "Add minimum one variant" });
        if (!req.files.mainImg) return res.status(400).send({ message: "Main image is required" });

        // ========== Slug Generation
        const slug = generateSlug(title);
        const existingProduct = await productSchema.findOne({ slug });
        if (existingProduct) return res.status(400).send({ message: "Product with this title already used" });

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

        // ========= Main Image Upload
        let mainImg;
        for (item of req.files.mainImg) {
            const result = await cloudinary.uploader.upload(item.path, {
                folder: "products",
            });
            fs.unlinkSync(item.path);
            mainImg = result.url;
        }
        // ========= sub Images Upload
        let productImages = [];
        if (req.files.images.length > 0) {
            for (item of req.files.images) {
                const result = await cloudinary.uploader.upload(item.path, {
                    folder: "products",
                });
                fs.unlinkSync(item.path);
                productImages.push(result.url);
            }
        }

        // ========= Create Product
        const product = new productSchema({
            title,
            description,
            slug,
            price,
            stock,
            category,
            variants,
            mainImg,
            images: productImages,
        });

        product.save();
        res.status(201).send({ message: "Product created successfully", product });

    } catch (error) {
        res.status(500).send({ message: "Internal server error" });
    }

};

// ============== update Product
const updateProduct = async (req, res) => {
    const { title, description, price, stock, category, variants } = req.body;

    // ========= slug 
    const { slug } = req.params;
    const existingProduct = await productSchema.findOne({ slug });
    if (!existingProduct) return res.status(400).send({ message: "Invalid request, product not found" });

    // ========= Update product fields if provided in the request body
    if (title) existingProduct.title = title;
    if (description) existingProduct.description = description;
    if (price) existingProduct.price = price;
    if (stock) existingProduct.stock = stock;
    if (category) existingProduct.category = category;
    if (variants && variants.length > 0) existingProduct.variants = variants;
    if (req?.files?.mainImg?.length > 0) {
        let mainImg;
        for (item of req.files.mainImg) {
            //============ delete existing main Image
            await cloudinary.uploader.destroy(existingProduct.mainImg.split("/").pop().split(".")[0]);
            const result = await cloudinary.uploader.upload(item.path, { folder: "products" });
            fs.unlinkSync(item.path);
            mainImg = result.url;
        }
        existingProduct.mainImg = mainImg;
    }

    // if (req?.files?.images?.length > 0) {
    //     let productImages = [];
    //     for (item of req.files.images) {
    //         //============ delete existing sub Images
    //         await cloudinary.uploader.destroy(item.filename);
    //         const result = await cloudinary.uploader.upload(item.path, { folder: "products" });
    //         fs.unlinkSync(item.path);
    //         productImages.push(result.url);
    //     }
    //     existingProduct.images = productImages;
    // }

    existingProduct.save();
    res.status(200).send({ message: "Product updated successfully", product: existingProduct });

};

module.exports = { createProduct, updateProduct }