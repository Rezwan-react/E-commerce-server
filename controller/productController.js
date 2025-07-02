const productSchema = require("../modal/productSchema");

const createProduct = async (req, res) => {
    const { title, description, price, stock, category, status, variants } = req.body;

    // ======== Validation
    if (!title) return res.status(400).send({ message: "Title is required" });
    if (!description) return res.status(400).send({ message: "Description is required" });
    if (!price) return res.status(400).send({ message: "Price is required" });
    if (!stock) return res.status(400).send({ message: "Stock is required" });
    if (!category) return res.status(400).send({ message: "Category is required" });
    // if (!status) return res.status(400).send({ message: "Status is required" });
    if (!variants) return res.status(400).send({ message: "Variants are required" });

    // ========== Image Validation
    variants.forEach(items => {
        // ========== Variant Name Validation
        if (!["color", "size"].includes(items.name)) {
            return res.status(400).send({ message: "Invalid variant name" });
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

    console.log(variants);
    res.send(variants);
    return;

    const product = new productSchema({
        title,
        description,
        price,
        stock,
        category,
        rstatus,
        variants
    });

    product.save();

    res.status(201).send({ message: "Product created successfully", product });

}

module.exports = { createProduct }