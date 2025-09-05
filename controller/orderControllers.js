const orderSchema = require("../modal/orderSchema");
const productSchema = require("../modal/productSchema");

// ==================== addNewOrder controller
const addNewOrder = async (req, res) => {
    const { items, shippingAddress, phone } = req.body;

    try {
        if (!items || items.length < 1)
            return res.status(400).send({ message: "Product is required" });
        if (!shippingAddress) return res.status(400).send({ message: "Address is required" });
        if (!phone) return res.status(400).send({ message: "Phone number is required" });

        let totalAmount = 0;
        // const populatedItems = [];

        for (const item of items) {
            const product = await productSchema.findById(item.productId);
            if (!product) return res.status(404).json({ message: "Product not found" });

            let itemPrice = product.price;

            // Add additional price from selected variants
            item.selectedVariants.forEach((variant) => {
                const productVariant = product.variants.find(
                    (v) => v.name === variant.name
                );
                if (productVariant) {
                    const matchedOption = productVariant.options.find((opt) => {
                        return opt.size === variant.option;
                    });
                    if (matchedOption) {
                        itemPrice += matchedOption.additionalPrice;
                        item.price = itemPrice;
                    }
                }
            });
            totalAmount += itemPrice * item.quantity;

            // populatedItems.push({
            //   product: item.product,
            //   quantity: item.quantity,
            //   selectedVariants: item.selectedVariants,
            //   price: itemPrice,
            // });
        }
        const order = new orderSchema({
            orderItems: items,
            user: req.user._id,
            shippingAddress,
            totalPrice: totalAmount,
        });

        const createdOrder = await order.save();

        res.status(201).send(createdOrder);
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
}
// =============== updateOrder controller
const updateOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        let updateFields = {};

        // Validate status if present
        const allowedStatuses = [
            "pending",
            "processing",
            "shipped",
            "delivered",
            "cancelled",
        ];

        if (status && !allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }
        updateFields.status = status;

        if (status === "delivered") {
            updateFields.isDelivered = true;
            updateFields.deliveredAt = new Date.now();
        }
        updateFields.updatedBy = req.user.id;

        // Fetch order
        const order = await orderSchema.findByIdAndUpdate(orderId, updateFields);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { addNewOrder, updateOrder };