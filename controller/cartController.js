const cartSchema = require("../modal/cartSchema");

// ========== add to cart controller
const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    try {
        // ========== Validate input
        if (!productId) return res.status(400).send({ message: "Product data is required" });

        let cart = await cartSchema.findOne({ user: req.user.id });

        if (!cart) {
            const newCart = new cartSchema({
                user: req.user.id,
                items: [],
            })
        }

        const index = cart.items.findIndex(item => item.product.toString() === productId);

        if (index > -1) {
            cart.items[index].quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        await cart.save()

        res.status(200).send({ message: "Product added to cart", cart });
    } catch (error) {
        res.status(500).send({ message: "Internal server error" });
    }

};

// ========== update cart controller
const updateCart = async (req, res) => {

    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (!productId) return res.status(400).send({ message: "Product ID required" });
    if (!quantity || quantity < 1) return res.status(400).send({ message: "Quantity must be greater than 0" });


}

module.exports = { addToCart, updateCart };
