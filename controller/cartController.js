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

    try {
        if (!productId) return res.status(400).send({ message: "Product ID required" });
        if (!quantity || quantity < 1) return res.status(400).send({ message: "Quantity must be greater than 0" });

        let cart = await cartSchema.findOne({ user: userId });
        if (!cart) {
            return res.status(404).send({ message: "Cart not found" });
        }

        const index = cart.items.findIndex(item => item.product.toString() === productId);
        if (index === -1) {
            return res.status(404).send({ message: "Product not found in cart" });
        }

        cart.items[index].quantity = quantity;

        await cart.save();

        res.status(200).send({ message: "Cart updated successfully", cart });
    } catch (error) {
        res.status(500).send({ message: "Internal server error" });
    }
}

// =========== delete cart controller
const deleteCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const productId = req.params.productId;

        let cart = await cartSchema.findOne({ user: userId });
        if (!cart) {
            return res.status(404).send({ message: "Cart not found" });
        }

        const initialLength = cart.items.length;
        cart.items = cart.items.filter(
            (item) => item.product.toString() !== productId
        );
        if (cart.items.length === initialLength) {
            return res.status(404).send({ message: "Product not found in cart" });
        }

        await cart.save();

        res.status(200).send({ message: "Product removed from cart", cart });
    } catch (error) {
        res.status(500).send({ message: "Internal server error" });
    }
}

module.exports = { addToCart, updateCart, deleteCart };
