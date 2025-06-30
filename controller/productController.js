const productSchema = require("../modal/productSchema");

const createProduct = async (req, res) => {
    const { title, description, price, stock, category, rstatus, variants } = req.body;

    // ======== Validation
    if (!title) return res.status(400).send({ message: "Title is required" });
    if (!description) return res.status(400).send({ message: "Description is required" });
    if (!price) return res.status(400).send({ message: "Price is required" });
    if (!stock) return res.status(400).send({ message: "Stock is required" });
    if (!category) return res.status(400).send({ message: "Category is required" });
    if (!rstatus) return res.status(400).send({ message: "Status is required" });
    if (!variants) return res.status(400).send({ message: "Variants are required" });

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