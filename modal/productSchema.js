const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    mainImg: {
        type: String,
        required: true
    },
    images: [{
        type: String,
    }],
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    rstatus: {
        type: String,
        enum: ["active", "pending", "reject"],
        default: 'pending'
    },
    variants: [{
        name: {
            type: String,
            enum: ["color", "size"]
        },
        options: [{
            colorname: {
                type: String,
                required: true
            },
            size: {
                type: String,
                required: true
            },
            additionalPrice: {
                type: Number,
                default: 0
            }
        }]
    }]
}, { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);