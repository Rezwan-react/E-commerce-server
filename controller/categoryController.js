const categorySchema = require("../modal/categorySchema");
const cloudinary = require("../helpers/cloudinary");
const fs = require('fs');

// ======== Create Category Controller
const createCategory = async (req, res) => {
    const { categoryName } = req.body;

    //  ======== Validation 
    if (!categoryName) return res.status(400).send({ message: 'Category name is required' });
    if (!req?.file?.path) return res.status(400).send({ message: 'Category image is required' });

    // =========== existing category check
    const existingCategory = await categorySchema.findOne({ categoryName: { $regex: `${categoryName}`, $options: 'i' } });
    if (existingCategory) return res.status(400).send({ message: "Category already exists" });

    // =========== upload image to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, { folder: "categories" })
    fs.unlinkSync(req.file.path)

    //  ======== Create Category
    const cateagor = new categorySchema({
        categoryName,
        image: result.url
    })
    cateagor.save()

    res.status(201).send({ success: "Category created successfully", cateagor });

}

// =========== Get Category controller
const gatCategory = async (req, res) => {
    const cateagors = await categorySchema.find()

    res.status(200).send({ message: "Category fetched successfully", cateagors });
}

module.exports = { createCategory, gatCategory };